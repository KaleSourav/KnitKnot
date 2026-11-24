// server/app.ts
import express from "express";

// node_modules/uncrypto/dist/crypto.node.mjs
import nodeCrypto from "node:crypto";
var subtle = nodeCrypto.webcrypto?.subtle || {};

// node_modules/@upstash/redis/chunk-HJPPKKDO.mjs
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var error_exports = {};
__export(error_exports, {
  UpstashError: () => UpstashError,
  UpstashJSONParseError: () => UpstashJSONParseError,
  UrlError: () => UrlError
});
var UpstashError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "UpstashError";
  }
};
var UrlError = class extends Error {
  constructor(url) {
    super(
      `Upstash Redis client was passed an invalid URL. You should pass a URL starting with https. Received: "${url}". `
    );
    this.name = "UrlError";
  }
};
var UpstashJSONParseError = class extends UpstashError {
  constructor(body, options) {
    const truncatedBody = body.length > 200 ? body.slice(0, 200) + "..." : body;
    super(`Unable to parse response body: ${truncatedBody}`, options);
    this.name = "UpstashJSONParseError";
  }
};
function parseJSON(value) {
  return JSON.parse(stripBOM(value));
}
function stripBOM(value) {
  return typeof value === "string" && value.startsWith("\uFEFF") ? value.slice(1) : value;
}
function parseRecursive(obj) {
  const parsed = Array.isArray(obj) ? obj.map((o) => {
    try {
      return parseRecursive(o);
    } catch {
      return o;
    }
  }) : parseJSON(obj);
  if (typeof parsed === "number" && parsed.toString() !== stripBOM(obj)) {
    return obj;
  }
  return parsed;
}
function parseResponse(result) {
  try {
    return parseRecursive(result);
  } catch {
    return result;
  }
}
function deserializeScanResponse(result) {
  return [result[0], ...parseResponse(result.slice(1))];
}
function deserializeScanWithTypesResponse(result) {
  const [cursor, keys] = result;
  const parsedKeys = [];
  for (let i = 0; i < keys.length; i += 2) {
    parsedKeys.push({ key: keys[i], type: keys[i + 1] });
  }
  return [cursor, parsedKeys];
}
function mergeHeaders(...headers) {
  const merged = {};
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of Object.entries(header)) {
      if (value !== void 0 && value !== null) {
        merged[key] = value;
      }
    }
  }
  return merged;
}
function setOwnProperty(obj, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      writable: true,
      configurable: true
    });
  } else {
    obj[key] = value;
  }
}
function kvArrayToObject(v) {
  if (typeof v === "object" && v !== null && !Array.isArray(v)) return v;
  if (!Array.isArray(v)) return {};
  const obj = {};
  for (let i = 0; i < v.length; i += 2) {
    if (typeof v[i] === "string") setOwnProperty(obj, v[i], v[i + 1]);
  }
  return obj;
}
var MAX_BUFFER_SIZE = 1024 * 1024;
var HttpClient = class {
  baseUrl;
  headers;
  options;
  readYourWrites;
  upstashSyncToken = "";
  hasCredentials;
  retry;
  constructor(config) {
    this.options = {
      backend: config.options?.backend,
      agent: config.agent,
      responseEncoding: config.responseEncoding ?? false,
      cache: config.cache,
      signal: config.signal,
      keepAlive: config.keepAlive ?? true
    };
    this.upstashSyncToken = "";
    this.readYourWrites = config.readYourWrites ?? true;
    this.baseUrl = (config.baseUrl || "").replace(/\/$/, "");
    const urlRegex = /^https?:\/\/[^\s#$./?].\S*$/;
    if (this.baseUrl && !urlRegex.test(this.baseUrl)) {
      throw new UrlError(this.baseUrl);
    }
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers
    };
    this.hasCredentials = Boolean(this.baseUrl && this.headers.authorization.split(" ")[1]);
    if (this.options.responseEncoding === "base64") {
      this.headers["Upstash-Encoding"] = "base64";
    }
    this.retry = typeof config.retry === "boolean" && !config.retry ? {
      attempts: 0,
      backoff: () => 0
    } : {
      attempts: config.retry?.retries ?? 5,
      backoff: config.retry?.backoff ?? ((retryCount) => Math.exp(retryCount) * 50)
    };
  }
  mergeTelemetry(telemetry) {
    this.headers = merge(this.headers, "Upstash-Telemetry-Runtime", telemetry.runtime);
    this.headers = merge(this.headers, "Upstash-Telemetry-Platform", telemetry.platform);
    this.headers = merge(this.headers, "Upstash-Telemetry-Sdk", telemetry.sdk);
  }
  async request(req) {
    if (this.readYourWrites) {
      this.headers["upstash-sync-token"] = this.upstashSyncToken;
    }
    const requestHeaders = mergeHeaders(this.headers, req.headers ?? {});
    const requestUrl = [this.baseUrl, ...(req.path ?? []).map((s) => encodePathSegment(s))].join(
      "/"
    );
    const isEventStream = requestHeaders.Accept === "text/event-stream";
    const signal = req.signal ?? this.options.signal;
    const isSignalFunction = typeof signal === "function";
    const requestOptions = {
      cache: this.options.cache,
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(req.body),
      keepalive: this.options.keepAlive,
      agent: this.options.agent,
      signal: isSignalFunction ? signal() : signal,
      /**
       * Fastly specific
       */
      backend: this.options.backend
    };
    if (!this.hasCredentials) {
      console.warn(
        "[Upstash Redis] Redis client was initialized without url or token. Failed to execute command."
      );
    }
    let res = null;
    let error = null;
    for (let i = 0; i <= this.retry.attempts; i++) {
      if (i > 0 && requestHeaders["Upstash-Telemetry-Sdk"]) {
        requestHeaders["Upstash-Telemetry-Retry"] = String(i);
      }
      try {
        res = await fetch(requestUrl, requestOptions);
        break;
      } catch (error_) {
        if (requestOptions.signal?.aborted && isSignalFunction) {
          throw error_;
        } else if (requestOptions.signal?.aborted) {
          const reason = requestOptions.signal.reason;
          const myBlob = new Blob([
            // Error reasons (e.g. the default DOMException) would serialize to an empty object
            JSON.stringify({ result: reason instanceof Error ? null : reason ?? null })
          ]);
          const myOptions = {
            status: 200,
            statusText: "Aborted"
          };
          res = new Response(myBlob, myOptions);
          break;
        }
        error = error_;
        if (i < this.retry.attempts) {
          await new Promise((r) => setTimeout(r, this.retry.backoff(i)));
        }
      }
    }
    if (!res) {
      throw error ?? new Error("Exhausted all retries");
    }
    if (!res.ok) {
      let body2;
      const rawBody2 = await res.text();
      try {
        body2 = JSON.parse(rawBody2);
      } catch (error2) {
        throw new UpstashJSONParseError(rawBody2, { cause: error2 });
      }
      throw new UpstashError(`${body2.error}, command was: ${JSON.stringify(req.body)}`);
    }
    if (this.readYourWrites) {
      const headers = res.headers;
      this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
    }
    if (isEventStream && req && req.onMessage && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      (async () => {
        try {
          let buffer = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            if (buffer.length > MAX_BUFFER_SIZE) {
              throw new Error("Buffer size exceeded (1MB)");
            }
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                req.onMessage?.(data);
              }
            }
          }
        } catch (error2) {
          if (error2 instanceof Error && error2.name === "AbortError") {
          } else {
            console.error("Stream reading error:", error2);
          }
        } finally {
          try {
            await reader.cancel();
          } catch {
          }
        }
      })();
      return { result: 1 };
    }
    let body;
    const rawBody = await res.text();
    try {
      body = JSON.parse(rawBody);
    } catch (error2) {
      throw new UpstashJSONParseError(rawBody, { cause: error2 });
    }
    if (this.readYourWrites) {
      const headers = res.headers;
      this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
    }
    if (this.options.responseEncoding === "base64") {
      if (Array.isArray(body)) {
        return body.map(({ result: result2, error: error2 }) => ({
          result: decode(result2),
          error: error2
        }));
      }
      const result = decode(body.result);
      return { result, error: body.error };
    }
    return body;
  }
};
function base64decode(b64) {
  let dec = "";
  try {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    dec = new TextDecoder().decode(bytes);
  } catch {
    dec = b64;
  }
  return dec;
}
function decode(raw) {
  let result = void 0;
  switch (typeof raw) {
    case "undefined": {
      return raw;
    }
    case "number": {
      result = raw;
      break;
    }
    case "object": {
      if (Array.isArray(raw)) {
        result = raw.map(
          (v) => typeof v === "string" ? base64decode(v) : Array.isArray(v) ? v.map((element) => decode(element)) : v
        );
      } else {
        result = null;
      }
      break;
    }
    case "string": {
      result = raw === "OK" ? "OK" : base64decode(raw);
      break;
    }
    default: {
      break;
    }
  }
  return result;
}
function merge(obj, key, value) {
  if (!value) {
    return obj;
  }
  if (!obj[key]) {
    obj[key] = value;
    return obj;
  }
  const values = obj[key].split(",").map((v) => v.trim());
  if (!values.includes(value.trim())) {
    obj[key] = [obj[key], value].join(",");
  }
  return obj;
}
function encodePathSegment(segment) {
  if (segment === "." || segment === "..") {
    throw new UpstashError(`"${segment}" can not be used in the request path.`);
  }
  return encodeURIComponent(segment);
}
var defaultSerializer = (c) => {
  switch (typeof c) {
    case "string":
    case "number":
    case "boolean": {
      return c;
    }
    default: {
      return JSON.stringify(c);
    }
  }
};
var Command = class {
  command;
  serialize;
  deserialize;
  headers;
  path;
  onMessage;
  isStreaming;
  signal;
  /**
   * Create a new command instance.
   *
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */
  constructor(command, opts) {
    this.serialize = defaultSerializer;
    this.deserialize = opts?.automaticDeserialization === void 0 || opts.automaticDeserialization ? opts?.deserialize ?? parseResponse : (x) => x;
    this.command = command.map((c) => this.serialize(c));
    this.headers = opts?.headers;
    this.path = opts?.path;
    this.onMessage = opts?.streamOptions?.onMessage;
    this.isStreaming = opts?.streamOptions?.isStreaming ?? false;
    this.signal = opts?.streamOptions?.signal;
    if (opts?.latencyLogging) {
      const originalExec = this.exec.bind(this);
      this.exec = async (client) => {
        const start = performance.now();
        const result = await originalExec(client);
        const end = performance.now();
        const loggerResult = (end - start).toFixed(2);
        console.log(
          `Latency for \x1B[38;2;19;185;39m${this.command[0].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${loggerResult} ms\x1B[0m`
        );
        return result;
      };
    }
  }
  /**
   * Execute the command using a client.
   */
  async exec(client) {
    const { result, error } = await client.request({
      body: this.command,
      path: this.path,
      upstashSyncToken: client.upstashSyncToken,
      headers: this.headers,
      onMessage: this.onMessage,
      isStreaming: this.isStreaming,
      signal: this.signal
    });
    if (error) {
      throw new UpstashError(error);
    }
    if (result === void 0) {
      throw new TypeError("Request did not return a result");
    }
    return this.deserialize(result);
  }
};
var ExecCommand = class extends Command {
  constructor(cmd, opts) {
    const normalizedCmd = cmd.map((arg) => typeof arg === "string" ? arg : String(arg));
    super(normalizedCmd, opts);
  }
};
var FIELD_TYPES = [
  "TEXT",
  "U64",
  "I64",
  "F64",
  "BOOL",
  "DATE",
  "KEYWORD",
  "FACET",
  "HYBRID"
];
function isFieldType(value) {
  return typeof value === "string" && FIELD_TYPES.includes(value);
}
function isDetailedField(value) {
  return typeof value === "object" && value !== null && "type" in value && isFieldType(value.type);
}
function isNestedSchema(value) {
  return typeof value === "object" && value !== null && !isDetailedField(value);
}
function flattenSchema(schema, pathPrefix = []) {
  const fields = [];
  for (const [key, value] of Object.entries(schema)) {
    const currentPath = [...pathPrefix, key];
    const pathString = currentPath.join(".");
    if (isFieldType(value)) {
      fields.push({
        path: pathString,
        type: value
      });
    } else if (isDetailedField(value)) {
      fields.push({
        path: pathString,
        type: value.type,
        fast: "fast" in value ? value.fast : void 0,
        noTokenize: "noTokenize" in value ? value.noTokenize : void 0,
        noStem: "noStem" in value ? value.noStem : void 0,
        from: "from" in value ? value.from : void 0
      });
    } else if (isNestedSchema(value)) {
      const nestedFields = flattenSchema(value, currentPath);
      fields.push(...nestedFields);
    }
  }
  return fields;
}
function hasFieldAbove(pathParts, names) {
  for (let length = 1; length < pathParts.length; length++) {
    if (names.has(pathParts.slice(0, length).join("."))) {
      return true;
    }
  }
  return false;
}
function isDocument(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function deserializeQueryResponse(rawResponse) {
  return rawResponse.map((itemRaw) => {
    const raw = itemRaw;
    const key = raw[0];
    const score = Number(raw[1]);
    const rawFields = raw[2];
    if (rawFields === void 0) {
      return { key, score };
    }
    if (!Array.isArray(rawFields) || rawFields.length === 0) {
      return { key, score, data: {} };
    }
    const fields = rawFields;
    if (fields.length === 1 && fields[0][0] === "$" && isDocument(fields[0][1])) {
      return { key, score, data: fields[0][1] };
    }
    const data = {};
    const names = new Set(fields.map((field) => field[0]));
    for (const fieldRaw of fields) {
      const key2 = fieldRaw[0];
      const value = fieldRaw[1];
      const pathParts = key2.split(".");
      if (hasFieldAbove(pathParts, names)) {
        setOwnProperty(data, key2, value);
        continue;
      }
      let currentObj = data;
      for (const pathPart of pathParts.slice(0, -1)) {
        const existing = Object.prototype.hasOwnProperty.call(currentObj, pathPart) ? currentObj[pathPart] : void 0;
        if (typeof existing === "object" && existing !== null) {
          currentObj = existing;
        } else {
          const nested = {};
          setOwnProperty(currentObj, pathPart, nested);
          currentObj = nested;
        }
      }
      setOwnProperty(currentObj, pathParts.at(-1), value);
    }
    return { key, score, data };
  });
}
function deserializeDescribeResponse(rawResponse) {
  const description = {};
  for (let i = 0; i < rawResponse.length; i += 2) {
    const descriptor = rawResponse[i];
    switch (descriptor) {
      case "name": {
        description["name"] = rawResponse[i + 1];
        break;
      }
      case "type": {
        description["dataType"] = rawResponse[i + 1].toLowerCase();
        break;
      }
      case "prefixes": {
        description["prefixes"] = rawResponse[i + 1];
        break;
      }
      case "language": {
        description["language"] = rawResponse[i + 1];
        break;
      }
      case "schema": {
        const schema = {};
        for (const fieldDescription of rawResponse[i + 1]) {
          const fieldName = fieldDescription[0];
          const fieldInfo = { type: fieldDescription[1] };
          if (fieldDescription.length > 2) {
            for (let j = 2; j < fieldDescription.length; j++) {
              const fieldOption = fieldDescription[j];
              switch (fieldOption) {
                case "NOSTEM": {
                  fieldInfo.noStem = true;
                  break;
                }
                case "NOTOKENIZE": {
                  fieldInfo.noTokenize = true;
                  break;
                }
                case "FAST": {
                  fieldInfo.fast = true;
                  break;
                }
                case "FROM": {
                  fieldInfo.from = fieldDescription[++j];
                  break;
                }
              }
            }
          }
          setOwnProperty(schema, fieldName, fieldInfo);
        }
        description["schema"] = schema;
        break;
      }
    }
  }
  return description;
}
function parseCountResponse(rawResponse) {
  return typeof rawResponse === "number" ? rawResponse : Number.parseInt(rawResponse, 10);
}
function deserializeAggregateResponse(rawResponse) {
  return parseAggregationArray(rawResponse);
}
function parseAggregationArray(arr) {
  const result = {};
  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "string") {
        setOwnProperty(
          result,
          key,
          value[0] === "buckets" ? parseBucketsValue(value) : parseStatsValue(value)
        );
      } else {
        setOwnProperty(result, key, parseAggregationArray(value));
      }
    } else {
      setOwnProperty(result, key, value);
    }
  }
  return result;
}
function coerceNumericString(value) {
  if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}
function parseStatsValue(arr) {
  const result = {};
  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    if (Array.isArray(value) && value.length > 0) {
      if (typeof value[0] === "string") {
        setOwnProperty(result, key, parseStatsValue(value));
      } else if (Array.isArray(value[0]) && typeof value[0][0] === "string") {
        setOwnProperty(
          result,
          key,
          value.map((item) => parseStatsValue(item))
        );
      } else {
        setOwnProperty(result, key, value);
      }
    } else {
      setOwnProperty(result, key, coerceNumericString(value));
    }
  }
  return result;
}
function parseBucketsValue(arr) {
  if (arr[0] === "buckets" && Array.isArray(arr[1])) {
    const result = {
      buckets: arr[1].map((bucket) => {
        const bucketObj = {};
        for (let i = 0; i < bucket.length; i += 2) {
          const key = bucket[i];
          const value = bucket[i + 1];
          setOwnProperty(
            bucketObj,
            key,
            Array.isArray(value) && value.length > 0 && typeof value[0] === "string" ? parseStatsValue(value) : value
          );
        }
        return bucketObj;
      })
    };
    for (let i = 2; i < arr.length; i += 2) {
      setOwnProperty(result, arr[i], arr[i + 1]);
    }
    return result;
  }
  return arr;
}
function buildQueryCommand(redisCommand, name, options) {
  const query = JSON.stringify(options?.filter ?? {});
  const command = [redisCommand, name, query];
  if (options?.limit !== void 0) {
    command.push("LIMIT", options.limit.toString());
  }
  if (options?.offset !== void 0) {
    command.push("OFFSET", options.offset.toString());
  }
  if (options?.select && Object.keys(options.select).length === 0) {
    command.push("NOCONTENT");
  }
  if (options) {
    if ("orderBy" in options && options.orderBy) {
      command.push("ORDERBY");
      for (const [field, direction] of Object.entries(options.orderBy)) {
        command.push(field, direction);
      }
    } else if ("scoreFunc" in options && options.scoreFunc) {
      command.push("SCOREFUNC", ...buildScoreFunc(options.scoreFunc));
    }
  }
  if (options?.highlight) {
    command.push(
      "HIGHLIGHT",
      "FIELDS",
      options.highlight.fields.length.toString(),
      ...options.highlight.fields
    );
    if (options.highlight.preTag && options.highlight.postTag) {
      command.push("TAGS", options.highlight.preTag, options.highlight.postTag);
    }
  }
  if (options?.select && Object.keys(options.select).length > 0) {
    command.push(
      "SELECT",
      Object.keys(options.select).length.toString(),
      ...Object.keys(options.select)
    );
  }
  return command;
}
function buildScoreFunc(scoreBy) {
  const result = [];
  if (typeof scoreBy === "string") {
    result.push("FIELDVALUE", scoreBy);
  } else if ("fields" in scoreBy) {
    if (scoreBy.combineMode) {
      result.push("COMBINEMODE", scoreBy.combineMode.toUpperCase());
    }
    if (scoreBy.scoreMode) {
      result.push("SCOREMODE", scoreBy.scoreMode.toUpperCase());
    }
    for (const field of scoreBy.fields) {
      result.push(...buildScoreFuncField(field));
    }
  } else {
    result.push(...buildScoreFuncField(scoreBy));
  }
  return result;
}
function buildScoreFuncField(field) {
  const result = [];
  if (typeof field === "string") {
    result.push("FIELDVALUE", field);
  } else {
    if (field.scoreMode) {
      result.push("SCOREMODE", field.scoreMode.toUpperCase());
    }
    result.push("FIELDVALUE", field.field);
    if (field.modifier) {
      result.push("MODIFIER", field.modifier.toUpperCase());
    }
    if (field.factor !== void 0) {
      result.push("FACTOR", field.factor.toString());
    }
    if (field.missing !== void 0) {
      result.push("MISSING", field.missing.toString());
    }
  }
  return result;
}
function buildCreateIndexCommand(params) {
  const { name, schema, dataType, language, skipInitialScan, existsOk } = params;
  let source;
  if (params.dataType === "stream") {
    source = ["ON", "STREAM", params.stream];
  } else {
    const prefixArray = Array.isArray(params.prefix) ? params.prefix : [params.prefix];
    source = [
      "ON",
      dataType.toUpperCase(),
      "PREFIX",
      prefixArray.length.toString(),
      ...prefixArray
    ];
  }
  const payload = [
    name,
    ...skipInitialScan ? ["SKIPINITIALSCAN"] : [],
    ...existsOk ? ["EXISTSOK"] : [],
    ...source,
    ...language ? ["LANGUAGE", language] : [],
    "SCHEMA"
  ];
  const fields = flattenSchema(schema);
  for (const field of fields) {
    payload.push(field.path, field.type);
    if (field.fast) {
      payload.push("FAST");
    }
    if (field.noTokenize) {
      payload.push("NOTOKENIZE");
    }
    if (field.noStem) {
      payload.push("NOSTEM");
    }
    if (field.from) {
      payload.push("FROM", field.from);
    }
  }
  return ["SEARCH.CREATE", ...payload];
}
function buildAggregateCommand(name, options) {
  const query = JSON.stringify(options?.filter ?? {});
  const aggregations = JSON.stringify(options.aggregations);
  return ["SEARCH.AGGREGATE", name, query, aggregations];
}
var SearchIndex = class {
  name;
  schema;
  client;
  constructor({ name, schema, client }) {
    this.name = name;
    this.schema = schema;
    this.client = client;
  }
  async waitIndexing() {
    const command = ["SEARCH.WAITINDEXING", this.name];
    return await new ExecCommand(command).exec(this.client);
  }
  async describe() {
    const command = ["SEARCH.DESCRIBE", this.name];
    const rawResult = await new ExecCommand(command).exec(
      this.client
    );
    if (!rawResult) return null;
    return deserializeDescribeResponse(rawResult);
  }
  async query(options) {
    const command = buildQueryCommand("SEARCH.QUERY", this.name, options);
    const rawResult = await new ExecCommand(command).exec(
      this.client
    );
    if (!rawResult) return rawResult;
    return deserializeQueryResponse(rawResult);
  }
  async aggregate(options) {
    const command = buildAggregateCommand(this.name, options);
    const rawResult = await new ExecCommand(
      command
    ).exec(this.client);
    return deserializeAggregateResponse(rawResult);
  }
  async count({
    filter
  }) {
    const command = buildQueryCommand("SEARCH.COUNT", this.name, {
      filter
    });
    const rawResult = await new ExecCommand(command).exec(
      this.client
    );
    return { count: parseCountResponse(rawResult) };
  }
  async drop() {
    const command = ["SEARCH.DROP", this.name];
    const result = await new ExecCommand(command).exec(this.client);
    return result;
  }
  async addAlias({ alias }) {
    const command = ["SEARCH.ALIASADD", alias, this.name];
    const result = await new ExecCommand(command).exec(this.client);
    return result;
  }
};
async function createIndex(client, params) {
  const { name, schema } = params;
  const createIndexCommand = buildCreateIndexCommand(params);
  await new ExecCommand(createIndexCommand).exec(client);
  return initIndex(client, { name, schema });
}
function initIndex(client, params) {
  const { name, schema } = params;
  return new SearchIndex({ name, schema, client });
}
async function listAliases(client) {
  const command = ["SEARCH.LISTALIASES"];
  const rawResult = await new ExecCommand(command).exec(client);
  if (rawResult === 0 || Array.isArray(rawResult) && rawResult.length === 0) {
    return {};
  }
  if (!Array.isArray(rawResult)) {
    return {};
  }
  const aliases = {};
  for (const pair of rawResult) {
    if (Array.isArray(pair) && pair.length === 2) {
      const [alias, index] = pair;
      setOwnProperty(aliases, alias, index);
    }
  }
  return aliases;
}
async function addAlias(client, { indexName, alias }) {
  const command = ["SEARCH.ALIASADD", alias, indexName];
  const result = await new ExecCommand(command).exec(client);
  return result;
}
async function delAlias(client, { alias }) {
  const command = ["SEARCH.ALIASDEL", alias];
  const result = await new ExecCommand(command).exec(client);
  return result;
}
function float32ToBase64(vector) {
  const bytes = new Uint8Array(vector.length * 4);
  const view = new DataView(bytes.buffer);
  for (const [i, value] of vector.entries()) {
    view.setFloat32(i * 4, value, true);
  }
  let binary = "";
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCodePoint(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
function serializeVector(vector) {
  if (Array.isArray(vector)) {
    return ["VALUES", vector.length, ...vector];
  }
  if (vector instanceof Float32Array) {
    return ["BASE64-FP32", float32ToBase64(vector)];
  }
  return ["BASE64-FP32", vector.base64];
}
function deserializeVectorValues(result) {
  if (result === null) {
    return null;
  }
  return result.map(Number);
}
function deserializeVectorQueryResponse(result) {
  return result.map(([id, score]) => ({ id: String(id), score: Number(score) }));
}
function deserializeVectorInfoResponse(result) {
  if (result === null) {
    return null;
  }
  const fields = Array.isArray(result) ? Object.fromEntries(
    Array.from({ length: Math.floor(result.length / 2) }, (_, i) => [
      String(result[i * 2]),
      result[i * 2 + 1]
    ])
  ) : result;
  return {
    dimension: Number(fields.dimension),
    metric: String(fields.metric).toUpperCase()
  };
}
var VectorAddCommand = class extends Command {
  constructor([index, id, vector], cmdOpts) {
    super(["VECTOR.ADD", index, id, ...serializeVector(vector)], cmdOpts);
  }
};
var VectorCountCommand = class extends Command {
  constructor([index], cmdOpts) {
    super(["VECTOR.COUNT", index], cmdOpts);
  }
};
var VectorCreateCommand = class extends Command {
  constructor([index, opts], cmdOpts) {
    const command = [
      "VECTOR.CREATE",
      index,
      "DIM",
      opts.dimension,
      "METRIC",
      opts.metric
    ];
    if (opts.existsOk) {
      command.push("EXISTSOK");
    }
    super(command, cmdOpts);
  }
};
var VectorDelCommand = class extends Command {
  constructor([index, id], cmdOpts) {
    super(["VECTOR.DEL", index, id], cmdOpts);
  }
};
var VectorDropCommand = class extends Command {
  constructor([index], cmdOpts) {
    super(["VECTOR.DROP", index], cmdOpts);
  }
};
var VectorGetCommand = class extends Command {
  constructor([index, id], cmdOpts) {
    super(["VECTOR.GET", index, id], {
      deserialize: deserializeVectorValues,
      ...cmdOpts
    });
  }
};
var VectorInfoCommand = class extends Command {
  constructor([index], cmdOpts) {
    super(["VECTOR.INFO", index], {
      deserialize: deserializeVectorInfoResponse,
      ...cmdOpts
    });
  }
};
var VectorQueryCommand = class extends Command {
  constructor([index, opts], cmdOpts) {
    const command = ["VECTOR.QUERY", index, "TOPK", opts.topK];
    if (opts.profile) {
      command.push("PROFILE", opts.profile);
    }
    command.push(...serializeVector(opts.vector));
    super(command, {
      deserialize: deserializeVectorQueryResponse,
      ...cmdOpts
    });
  }
};
var VectorIndex = class {
  name;
  client;
  commandOptions;
  constructor({ name, client, commandOptions }) {
    this.name = name;
    this.client = client;
    this.commandOptions = commandOptions;
  }
  /**
   * Adds a vector to the index, or overwrites the vector stored under `id`.
   *
   * @returns `1` if a new vector was inserted, `0` if an existing one was overwritten.
   */
  add(id, vector) {
    return new VectorAddCommand([this.name, id, vector], this.commandOptions).exec(this.client);
  }
  /**
   * Returns the vector stored under `id`, or `null` if it does not exist.
   */
  get(id) {
    return new VectorGetCommand([this.name, id], this.commandOptions).exec(this.client);
  }
  /**
   * Returns the `topK` nearest neighbours of the query vector.
   */
  query(options) {
    return new VectorQueryCommand([this.name, options], this.commandOptions).exec(this.client);
  }
  /**
   * Deletes the vector stored under `id`.
   *
   * @returns `1` if the vector existed and was removed, `0` otherwise.
   */
  delete(id) {
    return new VectorDelCommand([this.name, id], this.commandOptions).exec(this.client);
  }
  /**
   * Returns the number of vectors in the index.
   */
  count() {
    return new VectorCountCommand([this.name], this.commandOptions).exec(this.client);
  }
  /**
   * Returns the dimension and metric of the index, or `null` if it does not exist.
   */
  info() {
    return new VectorInfoCommand([this.name], this.commandOptions).exec(this.client);
  }
  /**
   * Drops the index and all vectors in it.
   *
   * @returns `1` if the index existed and was dropped, `0` otherwise.
   */
  drop() {
    return new VectorDropCommand([this.name], this.commandOptions).exec(this.client);
  }
};
async function createVectorIndex(client, { name, ...opts }, commandOptions) {
  await new VectorCreateCommand([name, opts], commandOptions).exec(client);
  return new VectorIndex({ name, client, commandOptions });
}
function initVectorIndex(client, name, commandOptions) {
  return new VectorIndex({ name, client, commandOptions });
}
function deserialize(result) {
  if (result.length === 0) {
    return null;
  }
  const obj = {};
  for (let i = 0; i < result.length; i += 2) {
    const key = result[i];
    const value = result[i + 1];
    try {
      setOwnProperty(obj, key, parseJSON(value));
    } catch {
      setOwnProperty(obj, key, value);
    }
  }
  return obj;
}
var HRandFieldCommand = class extends Command {
  constructor(cmd, opts) {
    const command = ["hrandfield", cmd[0]];
    if (typeof cmd[1] === "number") {
      command.push(cmd[1]);
    }
    if (cmd[2]) {
      command.push("WITHVALUES");
    }
    super(command, {
      // @ts-expect-error to silence compiler
      deserialize: cmd[2] ? (result) => deserialize(result) : opts?.deserialize,
      ...opts
    });
  }
};
var AppendCommand = class extends Command {
  constructor(cmd, opts) {
    super(["append", ...cmd], opts);
  }
};
var ArCountCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARCOUNT", ...cmd], opts);
  }
};
var ArDelCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARDEL", ...cmd], opts);
  }
};
var ArDelRangeCommand = class extends Command {
  constructor([key, ...ranges], opts) {
    super(["ARDELRANGE", key, ...ranges.flat()], opts);
  }
};
var ArGetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARGET", ...cmd], opts);
  }
};
var ArGetRangeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARGETRANGE", ...cmd], opts);
  }
};
var ArGrepCommand = class extends Command {
  constructor([key, start, end, opts], cmdOpts) {
    const command = ["ARGREP", key, start, end];
    for (const predicate of opts.predicates) {
      if ("exact" in predicate) {
        command.push("EXACT", predicate.exact);
      } else if ("match" in predicate) {
        command.push("MATCH", predicate.match);
      } else if ("glob" in predicate) {
        command.push("GLOB", predicate.glob);
      } else {
        command.push("RE", predicate.re);
      }
    }
    if (opts.combine) {
      command.push(opts.combine.toUpperCase());
    }
    if (opts.noCase) {
      command.push("NOCASE");
    }
    if (opts.withValues) {
      command.push("WITHVALUES");
    }
    if (opts.limit !== void 0) {
      command.push("LIMIT", opts.limit);
    }
    super(command, {
      deserialize: (result) => parseResponse(result).map(
        (item) => Array.isArray(item) ? [String(item[0]), item[1]] : String(item)
      ),
      ...cmdOpts
    });
  }
};
function toCamelCase(field) {
  return field.replaceAll(/-([a-z])/g, (_, char) => char.toUpperCase());
}
function deserializeArInfoResponse(result) {
  const entries = Array.isArray(result) ? Array.from({ length: Math.floor(result.length / 2) }, (_, i) => [
    result[i * 2],
    result[i * 2 + 1]
  ]) : Object.entries(result);
  const indexFields = /* @__PURE__ */ new Set(["len", "nextInsertIndex"]);
  const info = {};
  for (const [field, value] of entries) {
    const name = toCamelCase(String(field));
    if (indexFields.has(name)) {
      setOwnProperty(info, name, String(value));
      continue;
    }
    const numeric = typeof value === "number" ? value : Number(value);
    setOwnProperty(info, name, Number.isNaN(numeric) ? value : numeric);
  }
  return info;
}
var ArInfoCommand = class extends Command {
  constructor([key, opts], cmdOpts) {
    const command = ["ARINFO", key];
    if (opts?.full) {
      command.push("FULL");
    }
    super(command, {
      deserialize: deserializeArInfoResponse,
      ...cmdOpts
    });
  }
};
var ArInsertCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARINSERT", ...cmd], {
      deserialize: String,
      ...opts
    });
  }
};
var ArLastItemsCommand = class extends Command {
  constructor([key, count, opts], cmdOpts) {
    const command = ["ARLASTITEMS", key, count];
    if (opts?.rev) {
      command.push("REV");
    }
    super(command, cmdOpts);
  }
};
var ArLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARLEN", ...cmd], {
      deserialize: String,
      ...opts
    });
  }
};
var ArMGetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARMGET", ...cmd], opts);
  }
};
var ArMSetCommand = class extends Command {
  constructor([key, values], opts) {
    const pairs = Array.isArray(values) ? values : Object.entries(values);
    super(["ARMSET", key, ...pairs.flatMap(([index, value]) => [index, value])], opts);
  }
};
var ArNextCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARNEXT", ...cmd], {
      deserialize: (result) => result === null ? null : String(result),
      ...opts
    });
  }
};
var ArOpCommand = class extends Command {
  constructor([key, start, end, operation], opts) {
    const command = ["AROP", key, start, end];
    if (typeof operation === "string") {
      command.push(operation.toUpperCase());
    } else {
      command.push("MATCH", operation.match);
    }
    super(command, {
      deserialize: (result) => result === null ? null : Number(result),
      ...opts
    });
  }
};
var ArRingCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARRING", ...cmd], {
      deserialize: String,
      ...opts
    });
  }
};
var ArScanCommand = class extends Command {
  constructor([key, start, end, opts], cmdOpts) {
    const command = ["ARSCAN", key, start, end];
    if (opts?.limit !== void 0) {
      command.push("LIMIT", opts.limit);
    }
    super(command, {
      deserialize: (result) => parseResponse(result).map(([index, value]) => [
        String(index),
        value
      ]),
      ...cmdOpts
    });
  }
};
var ArSeekCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARSEEK", ...cmd], opts);
  }
};
var ArSetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ARSET", ...cmd], opts);
  }
};
var BitCountCommand = class extends Command {
  constructor([key, start, end], opts) {
    const command = ["bitcount", key];
    if (typeof start === "number") {
      command.push(start);
    }
    if (typeof end === "number") {
      command.push(end);
    }
    super(command, opts);
  }
};
var BitFieldCommand = class {
  constructor(args, client, opts, execOperation = (command) => command.exec(this.client)) {
    this.client = client;
    this.opts = opts;
    this.execOperation = execOperation;
    this.command = ["bitfield", ...args];
  }
  command;
  chain(...args) {
    this.command.push(...args);
    return this;
  }
  get(...args) {
    return this.chain("get", ...args);
  }
  set(...args) {
    return this.chain("set", ...args);
  }
  incrby(...args) {
    return this.chain("incrby", ...args);
  }
  overflow(overflow) {
    return this.chain("overflow", overflow);
  }
  exec() {
    const command = new Command(this.command, this.opts);
    return this.execOperation(command);
  }
};
var BitOpCommand = class extends Command {
  constructor(cmd, opts) {
    super(["bitop", ...cmd], opts);
  }
};
var BitPosCommand = class extends Command {
  constructor(cmd, opts) {
    super(["bitpos", ...cmd], opts);
  }
};
var ClientSetInfoCommand = class extends Command {
  constructor([attribute, value], opts) {
    super(["CLIENT", "SETINFO", attribute.toUpperCase(), value], opts);
  }
};
var CopyCommand = class extends Command {
  constructor([key, destinationKey, opts], commandOptions) {
    super(["COPY", key, destinationKey, ...opts?.replace ? ["REPLACE"] : []], {
      ...commandOptions,
      deserialize(result) {
        if (result > 0) {
          return "COPIED";
        }
        return "NOT_COPIED";
      }
    });
  }
};
var DBSizeCommand = class extends Command {
  constructor(opts) {
    super(["dbsize"], opts);
  }
};
var DecrCommand = class extends Command {
  constructor(cmd, opts) {
    super(["decr", ...cmd], opts);
  }
};
var DecrByCommand = class extends Command {
  constructor(cmd, opts) {
    super(["decrby", ...cmd], opts);
  }
};
var DelCommand = class extends Command {
  constructor(cmd, opts) {
    super(["del", ...cmd], opts);
  }
};
var EchoCommand = class extends Command {
  constructor(cmd, opts) {
    super(["echo", ...cmd], opts);
  }
};
var EvalROCommand = class extends Command {
  constructor([script, keys, args], opts) {
    super(["eval_ro", script, keys.length, ...keys, ...args ?? []], opts);
  }
};
var EvalCommand = class extends Command {
  constructor([script, keys, args], opts) {
    super(["eval", script, keys.length, ...keys, ...args ?? []], opts);
  }
};
var EvalshaROCommand = class extends Command {
  constructor([sha, keys, args], opts) {
    super(["evalsha_ro", sha, keys.length, ...keys, ...args ?? []], opts);
  }
};
var EvalshaCommand = class extends Command {
  constructor([sha, keys, args], opts) {
    super(["evalsha", sha, keys.length, ...keys, ...args ?? []], opts);
  }
};
var ExistsCommand = class extends Command {
  constructor(cmd, opts) {
    super(["exists", ...cmd], opts);
  }
};
var ExpireCommand = class extends Command {
  constructor(cmd, opts) {
    super(["expire", ...cmd.filter((arg) => arg !== void 0)], opts);
  }
};
var ExpireAtCommand = class extends Command {
  constructor(cmd, opts) {
    super(["expireat", ...cmd], opts);
  }
};
var FCallCommand = class extends Command {
  constructor([functionName, keys, args], opts) {
    super(["fcall", functionName, ...keys ? [keys.length, ...keys] : [0], ...args ?? []], opts);
  }
};
var FCallRoCommand = class extends Command {
  constructor([functionName, keys, args], opts) {
    super(
      ["fcall_ro", functionName, ...keys ? [keys.length, ...keys] : [0], ...args ?? []],
      opts
    );
  }
};
var FlushAllCommand = class extends Command {
  constructor(args, opts) {
    const command = ["flushall"];
    if (args && args.length > 0 && args[0].async) {
      command.push("async");
    }
    super(command, opts);
  }
};
var FlushDBCommand = class extends Command {
  constructor([opts], cmdOpts) {
    const command = ["flushdb"];
    if (opts?.async) {
      command.push("async");
    }
    super(command, cmdOpts);
  }
};
var FunctionDeleteCommand = class extends Command {
  constructor([libraryName], opts) {
    super(["function", "delete", libraryName], opts);
  }
};
var FunctionFlushCommand = class extends Command {
  constructor(opts) {
    super(["function", "flush"], opts);
  }
};
var FunctionListCommand = class extends Command {
  constructor([args], opts) {
    const command = ["function", "list"];
    if (args?.libraryName) {
      command.push("libraryname", args.libraryName);
    }
    if (args?.withCode) {
      command.push("withcode");
    }
    super(command, { deserialize: deserialize2, ...opts });
  }
};
function deserialize2(result) {
  if (!Array.isArray(result)) return [];
  return result.map((libRaw) => {
    const lib = kvArrayToObject(libRaw);
    const functionsParsed = lib.functions.map(
      (fnRaw) => kvArrayToObject(fnRaw)
    );
    return {
      libraryName: lib.library_name,
      engine: lib.engine,
      functions: functionsParsed.map((fn) => ({
        name: fn.name,
        description: fn.description ?? void 0,
        flags: fn.flags
      })),
      libraryCode: lib.library_code
    };
  });
}
var FunctionLoadCommand = class extends Command {
  constructor([args], opts) {
    super(["function", "load", ...args.replace ? ["replace"] : [], args.code], opts);
  }
};
var FunctionStatsCommand = class extends Command {
  constructor(opts) {
    super(["function", "stats"], { deserialize: deserialize3, ...opts });
  }
};
function deserialize3(result) {
  const rawEngines = kvArrayToObject(kvArrayToObject(result).engines);
  const parsedEngines = Object.fromEntries(
    Object.entries(rawEngines).map(([key, value]) => [key, kvArrayToObject(value)])
  );
  const final = {
    engines: Object.fromEntries(
      Object.entries(parsedEngines).map(([key, value]) => [
        key,
        {
          librariesCount: value.libraries_count,
          functionsCount: value.functions_count
        }
      ])
    )
  };
  return final;
}
var GeoAddCommand = class extends Command {
  constructor([key, arg1, ...arg2], opts) {
    const command = ["geoadd", key];
    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }
    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }
    if ("latitude" in arg1) {
      command.push(arg1.longitude, arg1.latitude, arg1.member);
    }
    command.push(
      ...arg2.flatMap(({ latitude, longitude, member }) => [longitude, latitude, member])
    );
    super(command, opts);
  }
};
var GeoDistCommand = class extends Command {
  constructor([key, member1, member2, unit = "M"], opts) {
    super(["GEODIST", key, member1, member2, unit], opts);
  }
};
var GeoHashCommand = class extends Command {
  constructor(cmd, opts) {
    const [key] = cmd;
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);
    super(["GEOHASH", key, ...members], opts);
  }
};
var GeoPosCommand = class extends Command {
  constructor(cmd, opts) {
    const [key] = cmd;
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);
    super(["GEOPOS", key, ...members], {
      deserialize: (result) => transform(result),
      ...opts
    });
  }
};
function transform(result) {
  const final = [];
  for (const pos of result) {
    if (!pos?.[0] || !pos?.[1]) {
      continue;
    }
    final.push({ lng: Number.parseFloat(pos[0]), lat: Number.parseFloat(pos[1]) });
  }
  return final;
}
var GeoSearchCommand = class extends Command {
  constructor([key, centerPoint, shape, order, opts], commandOptions) {
    const command = ["GEOSEARCH", key];
    if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
      command.push(centerPoint.type, centerPoint.member);
    }
    if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
      command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
    }
    if (shape.type === "BYRADIUS" || shape.type === "byradius") {
      command.push(shape.type, shape.radius, shape.radiusType);
    }
    if (shape.type === "BYBOX" || shape.type === "bybox") {
      command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
    }
    command.push(order);
    if (opts?.count) {
      command.push("COUNT", opts.count.limit, ...opts.count.any ? ["ANY"] : []);
    }
    const transform2 = (result) => {
      if (!opts?.withCoord && !opts?.withDist && !opts?.withHash) {
        return result.map((member) => {
          try {
            return { member: parseJSON(member) };
          } catch {
            return { member };
          }
        });
      }
      return result.map((members) => {
        let counter = 1;
        const obj = {};
        try {
          obj.member = parseJSON(members[0]);
        } catch {
          obj.member = members[0];
        }
        if (opts.withDist) {
          obj.dist = Number.parseFloat(members[counter++]);
        }
        if (opts.withHash) {
          obj.hash = members[counter++].toString();
        }
        if (opts.withCoord) {
          obj.coord = {
            long: Number.parseFloat(members[counter][0]),
            lat: Number.parseFloat(members[counter][1])
          };
        }
        return obj;
      });
    };
    super(
      [
        ...command,
        ...opts?.withCoord ? ["WITHCOORD"] : [],
        ...opts?.withDist ? ["WITHDIST"] : [],
        ...opts?.withHash ? ["WITHHASH"] : []
      ],
      {
        deserialize: transform2,
        ...commandOptions
      }
    );
  }
};
var GeoSearchStoreCommand = class extends Command {
  constructor([destination, key, centerPoint, shape, order, opts], commandOptions) {
    const command = ["GEOSEARCHSTORE", destination, key];
    if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
      command.push(centerPoint.type, centerPoint.member);
    }
    if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
      command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
    }
    if (shape.type === "BYRADIUS" || shape.type === "byradius") {
      command.push(shape.type, shape.radius, shape.radiusType);
    }
    if (shape.type === "BYBOX" || shape.type === "bybox") {
      command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
    }
    command.push(order);
    if (opts?.count) {
      command.push("COUNT", opts.count.limit, ...opts.count.any ? ["ANY"] : []);
    }
    super([...command, ...opts?.storeDist ? ["STOREDIST"] : []], commandOptions);
  }
};
var GetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["get", ...cmd], opts);
  }
};
var GetBitCommand = class extends Command {
  constructor(cmd, opts) {
    super(["getbit", ...cmd], opts);
  }
};
var GetDelCommand = class extends Command {
  constructor(cmd, opts) {
    super(["getdel", ...cmd], opts);
  }
};
var GetExCommand = class extends Command {
  constructor([key, opts], cmdOpts) {
    const command = ["getex", key];
    if (opts) {
      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("px", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("exat", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("pxat", opts.pxat);
      } else if ("persist" in opts && opts.persist) {
        command.push("persist");
      }
    }
    super(command, cmdOpts);
  }
};
var GetRangeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["getrange", ...cmd], opts);
  }
};
var GetSetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["getset", ...cmd], opts);
  }
};
var HDelCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hdel", ...cmd], opts);
  }
};
var HExistsCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hexists", ...cmd], opts);
  }
};
var HExpireCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields, seconds, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hexpire",
        key,
        seconds,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HExpireAtCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields, timestamp, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hexpireat",
        key,
        timestamp,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HExpireTimeCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hexpiretime", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HPersistCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpersist", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HPExpireCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields, milliseconds, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hpexpire",
        key,
        milliseconds,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HPExpireAtCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields, timestamp, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hpexpireat",
        key,
        timestamp,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HPExpireTimeCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpexpiretime", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HPTtlCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpttl", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HGetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hget", ...cmd], opts);
  }
};
function deserialize4(result) {
  if (result.length === 0) {
    return null;
  }
  const obj = {};
  for (let i = 0; i < result.length; i += 2) {
    const key = result[i];
    const value = result[i + 1];
    try {
      const valueIsNumberAndNotSafeInteger = !Number.isNaN(Number(value)) && !Number.isSafeInteger(Number(value));
      setOwnProperty(obj, key, valueIsNumberAndNotSafeInteger ? value : parseJSON(value));
    } catch {
      setOwnProperty(obj, key, value);
    }
  }
  return obj;
}
var HGetAllCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hgetall", ...cmd], {
      deserialize: (result) => deserialize4(result),
      ...opts
    });
  }
};
function deserialize5(fields, result) {
  if (result.every((field) => field === null)) {
    return null;
  }
  const obj = {};
  for (const [i, field] of fields.entries()) {
    try {
      setOwnProperty(obj, field, parseJSON(result[i]));
    } catch {
      setOwnProperty(obj, field, result[i]);
    }
  }
  return obj;
}
var HMGetCommand = class extends Command {
  constructor([key, ...fields], opts) {
    super(["hmget", key, ...fields], {
      deserialize: (result) => deserialize5(fields, result),
      ...opts
    });
  }
};
var HGetDelCommand = class extends Command {
  constructor([key, ...fields], opts) {
    super(["hgetdel", key, "FIELDS", fields.length, ...fields], {
      deserialize: (result) => deserialize5(fields.map(String), result),
      ...opts
    });
  }
};
var HGetExCommand = class extends Command {
  constructor([key, opts, ...fields], cmdOpts) {
    const command = ["hgetex", key];
    if ("ex" in opts && typeof opts.ex === "number") {
      command.push("EX", opts.ex);
    } else if ("px" in opts && typeof opts.px === "number") {
      command.push("PX", opts.px);
    } else if ("exat" in opts && typeof opts.exat === "number") {
      command.push("EXAT", opts.exat);
    } else if ("pxat" in opts && typeof opts.pxat === "number") {
      command.push("PXAT", opts.pxat);
    } else if ("persist" in opts && opts.persist) {
      command.push("PERSIST");
    }
    command.push("FIELDS", fields.length, ...fields);
    super(command, {
      deserialize: (result) => deserialize5(fields.map(String), result),
      ...cmdOpts
    });
  }
};
var HIncrByCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hincrby", ...cmd], opts);
  }
};
var HIncrByFloatCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hincrbyfloat", ...cmd], opts);
  }
};
var HKeysCommand = class extends Command {
  constructor([key], opts) {
    super(["hkeys", key], opts);
  }
};
var HLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hlen", ...cmd], opts);
  }
};
var HMSetCommand = class extends Command {
  constructor([key, kv], opts) {
    super(["hmset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])], opts);
  }
};
var HScanCommand = class extends Command {
  constructor([key, cursor, cmdOpts], opts) {
    const command = ["hscan", key, cursor];
    if (typeof cmdOpts?.match === "string") {
      command.push("match", cmdOpts.match);
    }
    if (typeof cmdOpts?.count === "number") {
      command.push("count", cmdOpts.count);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...opts
    });
  }
};
var HSetCommand = class extends Command {
  constructor([key, kv], opts) {
    super(["hset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])], opts);
  }
};
var HSetExCommand = class extends Command {
  constructor([key, opts, kv], cmdOpts) {
    const command = ["hsetex", key];
    if (opts.conditional) {
      command.push(opts.conditional.toUpperCase());
    }
    if (opts.expiration) {
      if ("ex" in opts.expiration && typeof opts.expiration.ex === "number") {
        command.push("EX", opts.expiration.ex);
      } else if ("px" in opts.expiration && typeof opts.expiration.px === "number") {
        command.push("PX", opts.expiration.px);
      } else if ("exat" in opts.expiration && typeof opts.expiration.exat === "number") {
        command.push("EXAT", opts.expiration.exat);
      } else if ("pxat" in opts.expiration && typeof opts.expiration.pxat === "number") {
        command.push("PXAT", opts.expiration.pxat);
      } else if ("keepttl" in opts.expiration && opts.expiration.keepttl) {
        command.push("KEEPTTL");
      }
    }
    const entries = Object.entries(kv);
    command.push("FIELDS", entries.length);
    for (const [field, value] of entries) {
      command.push(field, value);
    }
    super(command, cmdOpts);
  }
};
var HSetNXCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hsetnx", ...cmd], opts);
  }
};
var HStrLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hstrlen", ...cmd], opts);
  }
};
var HTtlCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["httl", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HValsCommand = class extends Command {
  constructor(cmd, opts) {
    super(["hvals", ...cmd], opts);
  }
};
var IncrCommand = class extends Command {
  constructor(cmd, opts) {
    super(["incr", ...cmd], opts);
  }
};
var IncrByCommand = class extends Command {
  constructor(cmd, opts) {
    super(["incrby", ...cmd], opts);
  }
};
var IncrByFloatCommand = class extends Command {
  constructor(cmd, opts) {
    super(["incrbyfloat", ...cmd], opts);
  }
};
var JsonArrAppendCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRAPPEND", ...cmd], opts);
  }
};
var JsonArrIndexCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRINDEX", ...cmd], opts);
  }
};
var JsonArrInsertCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRINSERT", ...cmd], opts);
  }
};
var JsonArrLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRLEN", cmd[0], cmd[1] ?? "$"], opts);
  }
};
var JsonArrPopCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRPOP", ...cmd], opts);
  }
};
var JsonArrTrimCommand = class extends Command {
  constructor(cmd, opts) {
    const path2 = cmd[1] ?? "$";
    const start = cmd[2] ?? 0;
    const stop = cmd[3] ?? 0;
    super(["JSON.ARRTRIM", cmd[0], path2, start, stop], opts);
  }
};
var JsonClearCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.CLEAR", ...cmd], opts);
  }
};
var JsonDelCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.DEL", ...cmd], opts);
  }
};
var JsonForgetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.FORGET", ...cmd], opts);
  }
};
var JsonGetCommand = class extends Command {
  constructor(cmd, opts) {
    const command = ["JSON.GET"];
    if (typeof cmd[1] === "string") {
      command.push(...cmd);
    } else {
      command.push(cmd[0]);
      if (cmd[1]) {
        if (cmd[1].indent) {
          command.push("INDENT", cmd[1].indent);
        }
        if (cmd[1].newline) {
          command.push("NEWLINE", cmd[1].newline);
        }
        if (cmd[1].space) {
          command.push("SPACE", cmd[1].space);
        }
      }
      command.push(...cmd.slice(2));
    }
    super(command, opts);
  }
};
var JsonMergeCommand = class extends Command {
  constructor(cmd, opts) {
    const command = ["JSON.MERGE", ...cmd];
    super(command, opts);
  }
};
var JsonMGetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.MGET", ...cmd[0], cmd[1]], opts);
  }
};
var JsonMSetCommand = class extends Command {
  constructor(cmd, opts) {
    const command = ["JSON.MSET"];
    for (const c of cmd) {
      command.push(c.key, c.path, c.value);
    }
    super(command, opts);
  }
};
var JsonNumIncrByCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.NUMINCRBY", ...cmd], opts);
  }
};
var JsonNumMultByCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.NUMMULTBY", ...cmd], opts);
  }
};
var JsonObjKeysCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.OBJKEYS", ...cmd], opts);
  }
};
var JsonObjLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.OBJLEN", ...cmd], opts);
  }
};
var JsonRespCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.RESP", ...cmd], opts);
  }
};
var JsonSetCommand = class extends Command {
  constructor(cmd, opts) {
    const command = ["JSON.SET", cmd[0], cmd[1], cmd[2]];
    if (cmd[3]) {
      if (cmd[3].nx) {
        command.push("NX");
      } else if (cmd[3].xx) {
        command.push("XX");
      }
    }
    super(command, opts);
  }
};
var JsonStrAppendCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.STRAPPEND", ...cmd], opts);
  }
};
var JsonStrLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.STRLEN", ...cmd], opts);
  }
};
var JsonToggleCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.TOGGLE", ...cmd], opts);
  }
};
var JsonTypeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["JSON.TYPE", ...cmd], opts);
  }
};
var KeysCommand = class extends Command {
  constructor(cmd, opts) {
    super(["keys", ...cmd], opts);
  }
};
var LIndexCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lindex", ...cmd], opts);
  }
};
var LInsertCommand = class extends Command {
  constructor(cmd, opts) {
    super(["linsert", ...cmd], opts);
  }
};
var LLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["llen", ...cmd], opts);
  }
};
var LMoveCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lmove", ...cmd], opts);
  }
};
var LmPopCommand = class extends Command {
  constructor(cmd, opts) {
    const [numkeys, keys, direction, count] = cmd;
    super(
      [
        "LMPOP",
        numkeys,
        ...keys,
        direction,
        ...typeof count === "number" ? ["COUNT", count] : []
      ],
      opts
    );
  }
};
var LPopCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lpop", ...cmd], opts);
  }
};
var LPosCommand = class extends Command {
  constructor(cmd, opts) {
    const args = ["lpos", cmd[0], cmd[1]];
    if (typeof cmd[2]?.rank === "number") {
      args.push("rank", cmd[2].rank);
    }
    if (typeof cmd[2]?.count === "number") {
      args.push("count", cmd[2].count);
    }
    if (typeof cmd[2]?.maxLen === "number") {
      args.push("maxLen", cmd[2].maxLen);
    }
    super(args, opts);
  }
};
var LPushCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lpush", ...cmd], opts);
  }
};
var LPushXCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lpushx", ...cmd], opts);
  }
};
var LRangeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lrange", ...cmd], opts);
  }
};
var LRemCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lrem", ...cmd], opts);
  }
};
var LSetCommand = class extends Command {
  constructor(cmd, opts) {
    super(["lset", ...cmd], opts);
  }
};
var LTrimCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ltrim", ...cmd], opts);
  }
};
var MGetCommand = class extends Command {
  constructor(cmd, opts) {
    const keys = Array.isArray(cmd[0]) ? cmd[0] : cmd;
    super(["mget", ...keys], opts);
  }
};
var MSetCommand = class extends Command {
  constructor([kv], opts) {
    super(["mset", ...Object.entries(kv).flatMap(([key, value]) => [key, value])], opts);
  }
};
var MSetNXCommand = class extends Command {
  constructor([kv], opts) {
    super(["msetnx", ...Object.entries(kv).flat()], opts);
  }
};
var PersistCommand = class extends Command {
  constructor(cmd, opts) {
    super(["persist", ...cmd], opts);
  }
};
var PExpireCommand = class extends Command {
  constructor(cmd, opts) {
    super(["pexpire", ...cmd], opts);
  }
};
var PExpireAtCommand = class extends Command {
  constructor(cmd, opts) {
    super(["pexpireat", ...cmd], opts);
  }
};
var PfAddCommand = class extends Command {
  constructor(cmd, opts) {
    super(["pfadd", ...cmd], opts);
  }
};
var PfCountCommand = class extends Command {
  constructor(cmd, opts) {
    super(["pfcount", ...cmd], opts);
  }
};
var PfMergeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["pfmerge", ...cmd], opts);
  }
};
var PingCommand = class extends Command {
  constructor(cmd, opts) {
    const command = ["ping"];
    if (cmd?.[0] !== void 0) {
      command.push(cmd[0]);
    }
    super(command, opts);
  }
};
var PSetEXCommand = class extends Command {
  constructor(cmd, opts) {
    super(["psetex", ...cmd], opts);
  }
};
var PTtlCommand = class extends Command {
  constructor(cmd, opts) {
    super(["pttl", ...cmd], opts);
  }
};
var PublishCommand = class extends Command {
  constructor(cmd, opts) {
    super(["publish", ...cmd], opts);
  }
};
var RandomKeyCommand = class extends Command {
  constructor(opts) {
    super(["randomkey"], opts);
  }
};
var RenameCommand = class extends Command {
  constructor(cmd, opts) {
    super(["rename", ...cmd], opts);
  }
};
var RenameNXCommand = class extends Command {
  constructor(cmd, opts) {
    super(["renamenx", ...cmd], opts);
  }
};
var RPopCommand = class extends Command {
  constructor(cmd, opts) {
    super(["rpop", ...cmd], opts);
  }
};
var RPushCommand = class extends Command {
  constructor(cmd, opts) {
    super(["rpush", ...cmd], opts);
  }
};
var RPushXCommand = class extends Command {
  constructor(cmd, opts) {
    super(["rpushx", ...cmd], opts);
  }
};
var SAddCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sadd", ...cmd], opts);
  }
};
var ScanCommand = class extends Command {
  constructor([cursor, opts], cmdOpts) {
    const command = ["scan", cursor];
    if (typeof opts?.match === "string") {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    if (opts && "withType" in opts && opts.withType === true) {
      command.push("withtype");
    } else if (opts && "type" in opts && opts.type && opts.type.length > 0) {
      command.push("type", opts.type);
    }
    super(command, {
      // @ts-expect-error ignore types here
      deserialize: opts?.withType ? deserializeScanWithTypesResponse : deserializeScanResponse,
      ...cmdOpts
    });
  }
};
var SCardCommand = class extends Command {
  constructor(cmd, opts) {
    super(["scard", ...cmd], opts);
  }
};
var ScriptExistsCommand = class extends Command {
  constructor(hashes, opts) {
    super(["script", "exists", ...hashes], {
      deserialize: (result) => result,
      ...opts
    });
  }
};
var ScriptFlushCommand = class extends Command {
  constructor([opts], cmdOpts) {
    const cmd = ["script", "flush"];
    if (opts?.sync) {
      cmd.push("sync");
    } else if (opts?.async) {
      cmd.push("async");
    }
    super(cmd, cmdOpts);
  }
};
var ScriptLoadCommand = class extends Command {
  constructor(args, opts) {
    super(["script", "load", ...args], opts);
  }
};
var SDiffCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sdiff", ...cmd], opts);
  }
};
var SDiffStoreCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sdiffstore", ...cmd], opts);
  }
};
var SetCommand = class extends Command {
  constructor([key, value, opts], cmdOpts) {
    const command = ["set", key, value];
    if (opts) {
      if ("nx" in opts && opts.nx) {
        command.push("nx");
      } else if ("xx" in opts && opts.xx) {
        command.push("xx");
      }
      if ("get" in opts && opts.get) {
        command.push("get");
      }
      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("px", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("exat", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("pxat", opts.pxat);
      } else if ("keepTtl" in opts && opts.keepTtl) {
        command.push("keepTtl");
      }
    }
    super(command, cmdOpts);
  }
};
var SetBitCommand = class extends Command {
  constructor(cmd, opts) {
    super(["setbit", ...cmd], opts);
  }
};
var SetExCommand = class extends Command {
  constructor(cmd, opts) {
    super(["setex", ...cmd], opts);
  }
};
var SetNxCommand = class extends Command {
  constructor(cmd, opts) {
    super(["setnx", ...cmd], opts);
  }
};
var SetRangeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["setrange", ...cmd], opts);
  }
};
var SInterCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sinter", ...cmd], opts);
  }
};
var SInterCardCommand = class extends Command {
  constructor(cmd, cmdOpts) {
    const [keys, opts] = cmd;
    const command = ["sintercard", keys.length, ...keys];
    if (opts?.limit !== void 0) {
      command.push("LIMIT", opts.limit);
    }
    super(command, cmdOpts);
  }
};
var SInterStoreCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sinterstore", ...cmd], opts);
  }
};
var SIsMemberCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sismember", ...cmd], opts);
  }
};
var SMembersCommand = class extends Command {
  constructor(cmd, opts) {
    super(["smembers", ...cmd], opts);
  }
};
var SMIsMemberCommand = class extends Command {
  constructor(cmd, opts) {
    super(["smismember", cmd[0], ...cmd[1]], opts);
  }
};
var SMoveCommand = class extends Command {
  constructor(cmd, opts) {
    super(["smove", ...cmd], opts);
  }
};
var SPopCommand = class extends Command {
  constructor([key, count], opts) {
    const command = ["spop", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
};
var SRandMemberCommand = class extends Command {
  constructor([key, count], opts) {
    const command = ["srandmember", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
};
var SRemCommand = class extends Command {
  constructor(cmd, opts) {
    super(["srem", ...cmd], opts);
  }
};
var SScanCommand = class extends Command {
  constructor([key, cursor, opts], cmdOpts) {
    const command = ["sscan", key, cursor];
    if (typeof opts?.match === "string") {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...cmdOpts
    });
  }
};
var StrLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["strlen", ...cmd], opts);
  }
};
var SUnionCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sunion", ...cmd], opts);
  }
};
var SUnionStoreCommand = class extends Command {
  constructor(cmd, opts) {
    super(["sunionstore", ...cmd], opts);
  }
};
var TimeCommand = class extends Command {
  constructor(opts) {
    super(["time"], opts);
  }
};
var TouchCommand = class extends Command {
  constructor(cmd, opts) {
    super(["touch", ...cmd], opts);
  }
};
var TtlCommand = class extends Command {
  constructor(cmd, opts) {
    super(["ttl", ...cmd], opts);
  }
};
var TypeCommand = class extends Command {
  constructor(cmd, opts) {
    super(["type", ...cmd], opts);
  }
};
var UnlinkCommand = class extends Command {
  constructor(cmd, opts) {
    super(["unlink", ...cmd], opts);
  }
};
var XAckCommand = class extends Command {
  constructor([key, group, id], opts) {
    const ids = Array.isArray(id) ? [...id] : [id];
    super(["XACK", key, group, ...ids], opts);
  }
};
var XAckDelCommand = class extends Command {
  constructor([key, group, opts, ...ids], cmdOpts) {
    const command = ["XACKDEL", key, group];
    command.push(opts.toUpperCase(), "IDS", ids.length, ...ids);
    super(command, cmdOpts);
  }
};
var XAddCommand = class extends Command {
  constructor([key, id, entries, opts], commandOptions) {
    const command = ["XADD", key];
    if (opts) {
      if (opts.nomkStream) {
        command.push("NOMKSTREAM");
      }
      if (opts.trim) {
        command.push(opts.trim.type, opts.trim.comparison, opts.trim.threshold);
        if (opts.trim.limit !== void 0) {
          command.push("LIMIT", opts.trim.limit);
        }
      }
    }
    command.push(id);
    for (const [k, v] of Object.entries(entries)) {
      command.push(k, v);
    }
    super(command, commandOptions);
  }
};
var XAutoClaim = class extends Command {
  constructor([key, group, consumer, minIdleTime, start, options], opts) {
    const commands = [];
    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (options?.justId) {
      commands.push("JUSTID");
    }
    super(["XAUTOCLAIM", key, group, consumer, minIdleTime, start, ...commands], opts);
  }
};
var XClaimCommand = class extends Command {
  constructor([key, group, consumer, minIdleTime, id, options], opts) {
    const ids = Array.isArray(id) ? [...id] : [id];
    const commands = [];
    if (options?.idleMS !== void 0) {
      commands.push("IDLE", options.idleMS);
    }
    if (options?.timeMS !== void 0) {
      commands.push("TIME", options.timeMS);
    }
    if (options?.retryCount !== void 0) {
      commands.push("RETRYCOUNT", options.retryCount);
    }
    if (options?.force) {
      commands.push("FORCE");
    }
    if (options?.justId) {
      commands.push("JUSTID");
    }
    if (options?.lastId) {
      commands.push("LASTID", options.lastId);
    }
    super(["XCLAIM", key, group, consumer, minIdleTime, ...ids, ...commands], opts);
  }
};
var XDelCommand = class extends Command {
  constructor([key, ids], opts) {
    const cmds = Array.isArray(ids) ? [...ids] : [ids];
    super(["XDEL", key, ...cmds], opts);
  }
};
var XDelExCommand = class extends Command {
  constructor([key, opts, ...ids], cmdOpts) {
    const command = ["XDELEX", key];
    if (opts) {
      command.push(opts.toUpperCase());
    }
    command.push("IDS", ids.length, ...ids);
    super(command, cmdOpts);
  }
};
var XGroupCommand = class extends Command {
  constructor([key, opts], commandOptions) {
    const command = ["XGROUP"];
    switch (opts.type) {
      case "CREATE": {
        command.push("CREATE", key, opts.group, opts.id);
        if (opts.options) {
          if (opts.options.MKSTREAM) {
            command.push("MKSTREAM");
          }
          if (opts.options.ENTRIESREAD !== void 0) {
            command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
          }
        }
        break;
      }
      case "CREATECONSUMER": {
        command.push("CREATECONSUMER", key, opts.group, opts.consumer);
        break;
      }
      case "DELCONSUMER": {
        command.push("DELCONSUMER", key, opts.group, opts.consumer);
        break;
      }
      case "DESTROY": {
        command.push("DESTROY", key, opts.group);
        break;
      }
      case "SETID": {
        command.push("SETID", key, opts.group, opts.id);
        if (opts.options?.ENTRIESREAD !== void 0) {
          command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
        }
        break;
      }
      default: {
        throw new Error("Invalid XGROUP");
      }
    }
    super(command, commandOptions);
  }
};
var XInfoCommand = class extends Command {
  constructor([key, options], opts) {
    const cmds = [];
    if (options.type === "CONSUMERS") {
      cmds.push("CONSUMERS", key, options.group);
    } else {
      cmds.push("GROUPS", key);
    }
    super(["XINFO", ...cmds], opts);
  }
};
var XLenCommand = class extends Command {
  constructor(cmd, opts) {
    super(["XLEN", ...cmd], opts);
  }
};
var XPendingCommand = class extends Command {
  constructor([key, group, start, end, count, options], opts) {
    const consumers = options?.consumer === void 0 ? [] : Array.isArray(options.consumer) ? [...options.consumer] : [options.consumer];
    super(
      [
        "XPENDING",
        key,
        group,
        ...options?.idleTime ? ["IDLE", options.idleTime] : [],
        start,
        end,
        count,
        ...consumers
      ],
      opts
    );
  }
};
function deserialize6(result) {
  const obj = {};
  for (const e of result) {
    for (let i = 0; i < e.length; i += 2) {
      const streamId = e[i];
      const entries = e[i + 1];
      if (!Object.prototype.hasOwnProperty.call(obj, streamId)) {
        setOwnProperty(obj, streamId, {});
      }
      for (let j = 0; j < entries.length; j += 2) {
        const field = entries[j];
        const value = entries[j + 1];
        try {
          setOwnProperty(obj[streamId], field, parseJSON(value));
        } catch {
          setOwnProperty(obj[streamId], field, value);
        }
      }
    }
  }
  return obj;
}
var XRangeCommand = class extends Command {
  constructor([key, start, end, count], opts) {
    const command = ["XRANGE", key, start, end];
    if (typeof count === "number") {
      command.push("COUNT", count);
    }
    super(command, {
      deserialize: (result) => deserialize6(result),
      ...opts
    });
  }
};
var UNBALANCED_XREAD_ERR = "ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified";
var XReadCommand = class extends Command {
  constructor([key, id, options], opts) {
    if (Array.isArray(key) && Array.isArray(id) && key.length !== id.length) {
      throw new Error(UNBALANCED_XREAD_ERR);
    }
    const commands = [];
    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (typeof options?.blockMS === "number") {
      commands.push("BLOCK", options.blockMS);
    }
    commands.push(
      "STREAMS",
      ...Array.isArray(key) ? [...key] : [key],
      ...Array.isArray(id) ? [...id] : [id]
    );
    super(["XREAD", ...commands], opts);
  }
};
var UNBALANCED_XREADGROUP_ERR = "ERR Unbalanced XREADGROUP list of streams: for each stream key an ID or '$' must be specified";
var XReadGroupCommand = class extends Command {
  constructor([group, consumer, key, id, options], opts) {
    if (Array.isArray(key) && Array.isArray(id) && key.length !== id.length) {
      throw new Error(UNBALANCED_XREADGROUP_ERR);
    }
    const commands = [];
    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (typeof options?.blockMS === "number") {
      commands.push("BLOCK", options.blockMS);
    }
    if (typeof options?.NOACK === "boolean" && options.NOACK) {
      commands.push("NOACK");
    }
    commands.push(
      "STREAMS",
      ...Array.isArray(key) ? [...key] : [key],
      ...Array.isArray(id) ? [...id] : [id]
    );
    super(["XREADGROUP", "GROUP", group, consumer, ...commands], opts);
  }
};
var XRevRangeCommand = class extends Command {
  constructor([key, end, start, count], opts) {
    const command = ["XREVRANGE", key, end, start];
    if (typeof count === "number") {
      command.push("COUNT", count);
    }
    super(command, {
      deserialize: (result) => deserialize7(result),
      ...opts
    });
  }
};
function deserialize7(result) {
  const obj = {};
  for (const e of result) {
    for (let i = 0; i < e.length; i += 2) {
      const streamId = e[i];
      const entries = e[i + 1];
      if (!Object.prototype.hasOwnProperty.call(obj, streamId)) {
        setOwnProperty(obj, streamId, {});
      }
      for (let j = 0; j < entries.length; j += 2) {
        const field = entries[j];
        const value = entries[j + 1];
        try {
          setOwnProperty(obj[streamId], field, parseJSON(value));
        } catch {
          setOwnProperty(obj[streamId], field, value);
        }
      }
    }
  }
  return obj;
}
var XTrimCommand = class extends Command {
  constructor([key, options], opts) {
    const { limit, strategy, threshold, exactness = "~" } = options;
    super(
      [
        "XTRIM",
        key,
        strategy,
        exactness,
        threshold,
        ...limit === void 0 ? [] : ["LIMIT", limit]
      ],
      opts
    );
  }
};
var ZAddCommand = class extends Command {
  constructor([key, arg1, ...arg2], opts) {
    const command = ["zadd", key];
    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }
    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }
    if ("incr" in arg1 && arg1.incr) {
      command.push("incr");
    }
    if ("lt" in arg1 && arg1.lt) {
      command.push("lt");
    } else if ("gt" in arg1 && arg1.gt) {
      command.push("gt");
    }
    if ("score" in arg1 && "member" in arg1) {
      command.push(arg1.score, arg1.member);
    }
    command.push(...arg2.flatMap(({ score, member }) => [score, member]));
    super(command, opts);
  }
};
var ZCardCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zcard", ...cmd], opts);
  }
};
var ZCountCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zcount", ...cmd], opts);
  }
};
var ZIncrByCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zincrby", ...cmd], opts);
  }
};
var ZInterStoreCommand = class extends Command {
  constructor([destination, numKeys, keyOrKeys, opts], cmdOpts) {
    const command = ["zinterstore", destination, numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
    }
    super(command, cmdOpts);
  }
};
var ZLexCountCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zlexcount", ...cmd], opts);
  }
};
var ZPopMaxCommand = class extends Command {
  constructor([key, count], opts) {
    const command = ["zpopmax", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
};
var ZPopMinCommand = class extends Command {
  constructor([key, count], opts) {
    const command = ["zpopmin", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
};
var ZRangeCommand = class extends Command {
  constructor([key, min, max, opts], cmdOpts) {
    const command = ["zrange", key, min, max];
    if (opts?.byScore) {
      command.push("byscore");
    }
    if (opts?.byLex) {
      command.push("bylex");
    }
    if (opts?.rev) {
      command.push("rev");
    }
    if (opts?.count !== void 0 && opts.offset !== void 0) {
      command.push("limit", opts.offset, opts.count);
    }
    if (opts?.withScores) {
      command.push("withscores");
    }
    super(command, cmdOpts);
  }
};
var ZRankCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zrank", ...cmd], opts);
  }
};
var ZRemCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zrem", ...cmd], opts);
  }
};
var ZRemRangeByLexCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zremrangebylex", ...cmd], opts);
  }
};
var ZRemRangeByRankCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zremrangebyrank", ...cmd], opts);
  }
};
var ZRemRangeByScoreCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zremrangebyscore", ...cmd], opts);
  }
};
var ZRevRankCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zrevrank", ...cmd], opts);
  }
};
var ZScanCommand = class extends Command {
  constructor([key, cursor, opts], cmdOpts) {
    const command = ["zscan", key, cursor];
    if (typeof opts?.match === "string") {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...cmdOpts
    });
  }
};
var ZScoreCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zscore", ...cmd], opts);
  }
};
var ZUnionCommand = class extends Command {
  constructor([numKeys, keyOrKeys, opts], cmdOpts) {
    const command = ["zunion", numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
      if (opts.withScores) {
        command.push("withscores");
      }
    }
    super(command, cmdOpts);
  }
};
var ZUnionStoreCommand = class extends Command {
  constructor([destination, numKeys, keyOrKeys, opts], cmdOpts) {
    const command = ["zunionstore", destination, numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
    }
    super(command, cmdOpts);
  }
};
var ZDiffStoreCommand = class extends Command {
  constructor(cmd, opts) {
    super(["zdiffstore", ...cmd], opts);
  }
};
var ZMScoreCommand = class extends Command {
  constructor(cmd, opts) {
    const [key, members] = cmd;
    super(["zmscore", key, ...members], opts);
  }
};
var Pipeline = class {
  client;
  commands;
  commandOptions;
  multiExec;
  constructor(opts) {
    this.client = opts.client;
    this.commands = [];
    this.commandOptions = opts.commandOptions;
    this.multiExec = opts.multiExec ?? false;
    if (this.commandOptions?.latencyLogging) {
      const originalExec = this.exec.bind(this);
      this.exec = async (options) => {
        const start = performance.now();
        const result = await (options ? originalExec(options) : originalExec());
        const end = performance.now();
        const loggerResult = (end - start).toFixed(2);
        console.log(
          `Latency for \x1B[38;2;19;185;39m${this.multiExec ? ["MULTI-EXEC"] : ["PIPELINE"].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${loggerResult} ms\x1B[0m`
        );
        return result;
      };
    }
  }
  exec = async (options) => {
    if (this.commands.length === 0) {
      throw new Error("Pipeline is empty");
    }
    const path2 = this.multiExec ? ["multi-exec"] : ["pipeline"];
    const res = await this.client.request({
      path: path2,
      body: Object.values(this.commands).map((c) => c.command)
    });
    return options?.keepErrors ? res.map(({ error, result }, i) => {
      return {
        error,
        result: this.commands[i].deserialize(result)
      };
    }) : res.map(({ error, result }, i) => {
      if (error) {
        throw new UpstashError(
          `Command ${i + 1} [ ${this.commands[i].command[0]} ] failed: ${error}`
        );
      }
      return this.commands[i].deserialize(result);
    });
  };
  /**
   * Returns the length of pipeline before the execution
   */
  length() {
    return this.commands.length;
  }
  /**
   * Pushes a command into the pipeline and returns a chainable instance of the
   * pipeline
   */
  chain(command) {
    this.commands.push(command);
    return this;
  }
  /**
   * @see https://redis.io/commands/append
   * @see node_modules/@upstash/redis/docs/commands/string/append.mdx
   */
  append = (...args) => this.chain(new AppendCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arcount
   * @see node_modules/@upstash/redis/docs/commands/array/arcount.mdx
   */
  arcount = (...args) => this.chain(new ArCountCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/ardel
   * @see node_modules/@upstash/redis/docs/commands/array/ardel.mdx
   */
  ardel = (...args) => this.chain(new ArDelCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/ardelrange
   * @see node_modules/@upstash/redis/docs/commands/array/ardelrange.mdx
   */
  ardelrange = (...args) => this.chain(new ArDelRangeCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arget
   * @see node_modules/@upstash/redis/docs/commands/array/arget.mdx
   */
  arget = (...args) => this.chain(new ArGetCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/argetrange
   * @see node_modules/@upstash/redis/docs/commands/array/argetrange.mdx
   */
  argetrange = (...args) => this.chain(new ArGetRangeCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/argrep
   * @see node_modules/@upstash/redis/docs/commands/array/argrep.mdx
   */
  argrep = (key, start, end, opts) => this.chain(new ArGrepCommand([key, start, end, opts], this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arinfo
   * @see node_modules/@upstash/redis/docs/commands/array/arinfo.mdx
   */
  arinfo = (...args) => this.chain(new ArInfoCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arinsert
   * @see node_modules/@upstash/redis/docs/commands/array/arinsert.mdx
   */
  arinsert = (key, ...values) => this.chain(new ArInsertCommand([key, ...values], this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arlastitems
   * @see node_modules/@upstash/redis/docs/commands/array/arlastitems.mdx
   */
  arlastitems = (...args) => this.chain(new ArLastItemsCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arlen
   * @see node_modules/@upstash/redis/docs/commands/array/arlen.mdx
   */
  arlen = (...args) => this.chain(new ArLenCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/armget
   * @see node_modules/@upstash/redis/docs/commands/array/armget.mdx
   */
  armget = (...args) => this.chain(new ArMGetCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/armset
   * @see node_modules/@upstash/redis/docs/commands/array/armset.mdx
   */
  armset = (key, values) => this.chain(new ArMSetCommand([key, values], this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arnext
   * @see node_modules/@upstash/redis/docs/commands/array/arnext.mdx
   */
  arnext = (...args) => this.chain(new ArNextCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arop
   * @see node_modules/@upstash/redis/docs/commands/array/arop.mdx
   */
  arop = (key, start, end, operation) => this.chain(new ArOpCommand([key, start, end, operation], this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arring
   * @see node_modules/@upstash/redis/docs/commands/array/arring.mdx
   */
  arring = (key, size, ...values) => this.chain(new ArRingCommand([key, size, ...values], this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arscan
   * @see node_modules/@upstash/redis/docs/commands/array/arscan.mdx
   */
  arscan = (...args) => this.chain(new ArScanCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arseek
   * @see node_modules/@upstash/redis/docs/commands/array/arseek.mdx
   */
  arseek = (...args) => this.chain(new ArSeekCommand(args, this.commandOptions));
  /**
   * @see https://upstash.com/docs/redis/commands/array/arset
   * @see node_modules/@upstash/redis/docs/commands/array/arset.mdx
   */
  arset = (key, index, ...values) => this.chain(new ArSetCommand([key, index, ...values], this.commandOptions));
  /**
   * @see https://redis.io/commands/bitcount
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitcount.mdx
   */
  bitcount = (...args) => this.chain(new BitCountCommand(args, this.commandOptions));
  /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.pipeline()
   *   .bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [[0, 1]]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */
  bitfield = (...args) => new BitFieldCommand(args, this.client, this.commandOptions, this.chain.bind(this));
  /**
   * @see https://redis.io/commands/bitop
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitop.mdx
   */
  bitop = (op, destinationKey, sourceKey, ...sourceKeys) => this.chain(
    new BitOpCommand([op, destinationKey, sourceKey, ...sourceKeys], this.commandOptions)
  );
  /**
   * @see https://redis.io/commands/bitpos
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitpos.mdx
   */
  bitpos = (...args) => this.chain(new BitPosCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/client-setinfo
   * @see node_modules/@upstash/redis/docs/commands/connection/client_setinfo.mdx
   */
  clientSetinfo = (...args) => this.chain(new ClientSetInfoCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/copy
   */
  copy = (...args) => this.chain(new CopyCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zdiffstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zdiffstore.mdx
   */
  zdiffstore = (...args) => this.chain(new ZDiffStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/dbsize
   * @see node_modules/@upstash/redis/docs/commands/server/dbsize.mdx
   */
  dbsize = () => this.chain(new DBSizeCommand(this.commandOptions));
  /**
   * @see https://redis.io/commands/decr
   * @see node_modules/@upstash/redis/docs/commands/string/decr.mdx
   */
  decr = (...args) => this.chain(new DecrCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/decrby
   * @see node_modules/@upstash/redis/docs/commands/string/decrby.mdx
   */
  decrby = (...args) => this.chain(new DecrByCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/del
   * @see node_modules/@upstash/redis/docs/commands/generic/del.mdx
   */
  del = (...args) => this.chain(new DelCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/echo
   * @see node_modules/@upstash/redis/docs/commands/auth/echo.mdx
   */
  echo = (...args) => this.chain(new EchoCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/eval_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval_ro.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  evalRo = (...args) => this.chain(new EvalROCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/eval
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  eval = (...args) => this.chain(new EvalCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/evalsha_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha_ro.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  evalshaRo = (...args) => this.chain(new EvalshaROCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/evalsha
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  evalsha = (...args) => this.chain(new EvalshaCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/exists
   * @see node_modules/@upstash/redis/docs/commands/generic/exists.mdx
   */
  exists = (...args) => this.chain(new ExistsCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/expire
   * @see node_modules/@upstash/redis/docs/commands/generic/expire.mdx
   */
  expire = (...args) => this.chain(new ExpireCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/expireat
   * @see node_modules/@upstash/redis/docs/commands/generic/expireat.mdx
   */
  expireat = (...args) => this.chain(new ExpireAtCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/flushall
   * @see node_modules/@upstash/redis/docs/commands/server/flushall.mdx
   */
  flushall = (args) => this.chain(new FlushAllCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/flushdb
   * @see node_modules/@upstash/redis/docs/commands/server/flushdb.mdx
   */
  flushdb = (...args) => this.chain(new FlushDBCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/geoadd
   */
  geoadd = (...args) => this.chain(new GeoAddCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/geodist
   */
  geodist = (...args) => this.chain(new GeoDistCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/geopos
   */
  geopos = (...args) => this.chain(new GeoPosCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/geohash
   */
  geohash = (...args) => this.chain(new GeoHashCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/geosearch
   */
  geosearch = (...args) => this.chain(new GeoSearchCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/geosearchstore
   */
  geosearchstore = (...args) => this.chain(new GeoSearchStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/get
   * @see node_modules/@upstash/redis/docs/commands/string/get.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  get = (...args) => this.chain(new GetCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/getbit.mdx
   */
  getbit = (...args) => this.chain(new GetBitCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getdel
   * @see node_modules/@upstash/redis/docs/commands/string/getdel.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  getdel = (...args) => this.chain(new GetDelCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getex
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  getex = (...args) => this.chain(new GetExCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getrange
   * @see node_modules/@upstash/redis/docs/commands/string/getrange.mdx
   */
  getrange = (...args) => this.chain(new GetRangeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getset
   * @see node_modules/@upstash/redis/docs/commands/string/getset.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  getset = (key, value) => this.chain(new GetSetCommand([key, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/hdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hdel.mdx
   */
  hdel = (...args) => this.chain(new HDelCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hexists
   * @see node_modules/@upstash/redis/docs/commands/hash/hexists.mdx
   */
  hexists = (...args) => this.chain(new HExistsCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpire.mdx
   */
  hexpire = (...args) => this.chain(new HExpireCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpireat.mdx
   */
  hexpireat = (...args) => this.chain(new HExpireAtCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpiretime.mdx
   */
  hexpiretime = (...args) => this.chain(new HExpireTimeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/httl
   * @see node_modules/@upstash/redis/docs/commands/hash/httl.mdx
   */
  httl = (...args) => this.chain(new HTtlCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hpexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpire.mdx
   */
  hpexpire = (...args) => this.chain(new HPExpireCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hpexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpireat.mdx
   */
  hpexpireat = (...args) => this.chain(new HPExpireAtCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hpexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpiretime.mdx
   */
  hpexpiretime = (...args) => this.chain(new HPExpireTimeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hpttl
   * @see node_modules/@upstash/redis/docs/commands/hash/hpttl.mdx
   */
  hpttl = (...args) => this.chain(new HPTtlCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hpersist
   * @see node_modules/@upstash/redis/docs/commands/hash/hpersist.mdx
   */
  hpersist = (...args) => this.chain(new HPersistCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hget
   * @see node_modules/@upstash/redis/docs/commands/hash/hget.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  hget = (...args) => this.chain(new HGetCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hgetall
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetall.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hgetall returns a flat array instead, such as
   * ["text", "123", "version", "1"], and [] for a missing key.
   */
  hgetall = (...args) => this.chain(new HGetAllCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hgetdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetdel.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hgetdel returns an array of values in field order instead,
   * such as ["123", null], with null for each field when the key is missing.
   */
  hgetdel = (...args) => this.chain(new HGetDelCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hgetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetex.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hgetex returns an array of values in field order instead,
   * such as ["123", null], with null for each field when the key is missing.
   */
  hgetex = (...args) => this.chain(new HGetExCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hincrby
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrby.mdx
   */
  hincrby = (...args) => this.chain(new HIncrByCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hincrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrbyfloat.mdx
   */
  hincrbyfloat = (...args) => this.chain(new HIncrByFloatCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hkeys
   * @see node_modules/@upstash/redis/docs/commands/hash/hkeys.mdx
   */
  hkeys = (...args) => this.chain(new HKeysCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hlen.mdx
   */
  hlen = (...args) => this.chain(new HLenCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hmget
   * @see node_modules/@upstash/redis/docs/commands/hash/hmget.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hmget returns an array of values in field order instead,
   * such as ["123", null], with null for each field when the key is missing.
   */
  hmget = (...args) => this.chain(new HMGetCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = (key, kv) => this.chain(new HMSetCommand([key, kv], this.commandOptions));
  /**
   * @see https://redis.io/commands/hrandfield
   * @see node_modules/@upstash/redis/docs/commands/hash/hrandfield.mdx
   */
  hrandfield = (key, count, withValues) => this.chain(new HRandFieldCommand([key, count, withValues], this.commandOptions));
  /**
   * @see https://redis.io/commands/hscan
   * @see node_modules/@upstash/redis/docs/commands/hash/hscan.mdx
   */
  hscan = (...args) => this.chain(new HScanCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hset
   * @see node_modules/@upstash/redis/docs/commands/hash/hset.mdx
   */
  hset = (key, kv) => this.chain(new HSetCommand([key, kv], this.commandOptions));
  /**
   * @see https://redis.io/commands/hsetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetex.mdx
   */
  hsetex = (...args) => this.chain(new HSetExCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hsetnx
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetnx.mdx
   */
  hsetnx = (key, field, value) => this.chain(new HSetNXCommand([key, field, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/hstrlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hstrlen.mdx
   */
  hstrlen = (...args) => this.chain(new HStrLenCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/hvals
   * @see node_modules/@upstash/redis/docs/commands/hash/hvals.mdx
   */
  hvals = (...args) => this.chain(new HValsCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/incr
   * @see node_modules/@upstash/redis/docs/commands/string/incr.mdx
   */
  incr = (...args) => this.chain(new IncrCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/incrby
   * @see node_modules/@upstash/redis/docs/commands/string/incrby.mdx
   */
  incrby = (...args) => this.chain(new IncrByCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/incrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/string/incrbyfloat.mdx
   */
  incrbyfloat = (...args) => this.chain(new IncrByFloatCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/keys
   * @see node_modules/@upstash/redis/docs/commands/generic/keys.mdx
   */
  keys = (...args) => this.chain(new KeysCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lindex
   * @see node_modules/@upstash/redis/docs/commands/list/lindex.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  lindex = (...args) => this.chain(new LIndexCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/linsert
   * @see node_modules/@upstash/redis/docs/commands/list/linsert.mdx
   */
  linsert = (key, direction, pivot, value) => this.chain(new LInsertCommand([key, direction, pivot, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/llen
   * @see node_modules/@upstash/redis/docs/commands/list/llen.mdx
   */
  llen = (...args) => this.chain(new LLenCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lmove
   * @see node_modules/@upstash/redis/docs/commands/list/lmove.mdx
   */
  lmove = (...args) => this.chain(new LMoveCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lpop
   * @see node_modules/@upstash/redis/docs/commands/list/lpop.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  lpop = (...args) => this.chain(new LPopCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lmpop
   */
  lmpop = (...args) => this.chain(new LmPopCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lpos
   * @see node_modules/@upstash/redis/docs/commands/list/lpos.mdx
   */
  lpos = (...args) => this.chain(new LPosCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lpush
   * @see node_modules/@upstash/redis/docs/commands/list/lpush.mdx
   */
  lpush = (key, ...elements) => this.chain(new LPushCommand([key, ...elements], this.commandOptions));
  /**
   * @see https://redis.io/commands/lpushx
   * @see node_modules/@upstash/redis/docs/commands/list/lpushx.mdx
   */
  lpushx = (key, ...elements) => this.chain(new LPushXCommand([key, ...elements], this.commandOptions));
  /**
   * @see https://redis.io/commands/lrange
   * @see node_modules/@upstash/redis/docs/commands/list/lrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  lrange = (...args) => this.chain(new LRangeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/lrem
   * @see node_modules/@upstash/redis/docs/commands/list/lrem.mdx
   */
  lrem = (key, count, value) => this.chain(new LRemCommand([key, count, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/lset
   * @see node_modules/@upstash/redis/docs/commands/list/lset.mdx
   */
  lset = (key, index, value) => this.chain(new LSetCommand([key, index, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/ltrim
   * @see node_modules/@upstash/redis/docs/commands/list/ltrim.mdx
   */
  ltrim = (...args) => this.chain(new LTrimCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/mget
   * @see node_modules/@upstash/redis/docs/commands/string/mget.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  mget = (...args) => this.chain(new MGetCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/mset
   * @see node_modules/@upstash/redis/docs/commands/string/mset.mdx
   */
  mset = (kv) => this.chain(new MSetCommand([kv], this.commandOptions));
  /**
   * @see https://redis.io/commands/msetnx
   * @see node_modules/@upstash/redis/docs/commands/string/msetnx.mdx
   */
  msetnx = (kv) => this.chain(new MSetNXCommand([kv], this.commandOptions));
  /**
   * @see https://redis.io/commands/persist
   * @see node_modules/@upstash/redis/docs/commands/generic/persist.mdx
   */
  persist = (...args) => this.chain(new PersistCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/pexpire
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpire.mdx
   */
  pexpire = (...args) => this.chain(new PExpireCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/pexpireat
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpireat.mdx
   */
  pexpireat = (...args) => this.chain(new PExpireAtCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/pfadd
   */
  pfadd = (...args) => this.chain(new PfAddCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/pfcount
   */
  pfcount = (...args) => this.chain(new PfCountCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/pfmerge
   */
  pfmerge = (...args) => this.chain(new PfMergeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/ping
   * @see node_modules/@upstash/redis/docs/commands/auth/ping.mdx
   */
  ping = (args) => this.chain(new PingCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = (key, ttl, value) => this.chain(new PSetEXCommand([key, ttl, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/pttl
   * @see node_modules/@upstash/redis/docs/commands/generic/pttl.mdx
   */
  pttl = (...args) => this.chain(new PTtlCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/publish
   * @see node_modules/@upstash/redis/docs/commands/pubsub/publish.mdx
   */
  publish = (...args) => this.chain(new PublishCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/randomkey
   * @see node_modules/@upstash/redis/docs/commands/generic/randomkey.mdx
   */
  randomkey = () => this.chain(new RandomKeyCommand(this.commandOptions));
  /**
   * @see https://redis.io/commands/rename
   * @see node_modules/@upstash/redis/docs/commands/generic/rename.mdx
   */
  rename = (...args) => this.chain(new RenameCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/renamenx
   * @see node_modules/@upstash/redis/docs/commands/generic/renamenx.mdx
   */
  renamenx = (...args) => this.chain(new RenameNXCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/rpop
   * @see node_modules/@upstash/redis/docs/commands/list/rpop.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  rpop = (...args) => this.chain(new RPopCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/rpush
   * @see node_modules/@upstash/redis/docs/commands/list/rpush.mdx
   */
  rpush = (key, ...elements) => this.chain(new RPushCommand([key, ...elements], this.commandOptions));
  /**
   * @see https://redis.io/commands/rpushx
   * @see node_modules/@upstash/redis/docs/commands/list/rpushx.mdx
   */
  rpushx = (key, ...elements) => this.chain(new RPushXCommand([key, ...elements], this.commandOptions));
  /**
   * @see https://redis.io/commands/sadd
   * @see node_modules/@upstash/redis/docs/commands/set/sadd.mdx
   */
  sadd = (key, member, ...members) => this.chain(new SAddCommand([key, member, ...members], this.commandOptions));
  /**
   * @see https://redis.io/commands/scan
   * @see node_modules/@upstash/redis/docs/commands/generic/scan.mdx
   */
  scan = (...args) => this.chain(new ScanCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/scard
   * @see node_modules/@upstash/redis/docs/commands/set/scard.mdx
   */
  scard = (...args) => this.chain(new SCardCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/script-exists
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_exists.mdx
   */
  scriptExists = (...args) => this.chain(new ScriptExistsCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/script-flush
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_flush.mdx
   */
  scriptFlush = (...args) => this.chain(new ScriptFlushCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/script-load
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_load.mdx
   */
  scriptLoad = (...args) => this.chain(new ScriptLoadCommand(args, this.commandOptions));
  /*)*
   * @see https://redis.io/commands/sdiff
   * @see node_modules/@upstash/redis/docs/commands/set/sdiff.mdx
   */
  sdiff = (...args) => this.chain(new SDiffCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sdiffstore
   * @see node_modules/@upstash/redis/docs/commands/set/sdiffstore.mdx
   */
  sdiffstore = (...args) => this.chain(new SDiffStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/set
   * @see node_modules/@upstash/redis/docs/commands/string/set.mdx
   */
  set = (key, value, opts) => this.chain(new SetCommand([key, value, opts], this.commandOptions));
  /**
   * @see https://redis.io/commands/setbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/setbit.mdx
   */
  setbit = (...args) => this.chain(new SetBitCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/setex
   */
  setex = (key, ttl, value) => this.chain(new SetExCommand([key, ttl, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = (key, value) => this.chain(new SetNxCommand([key, value], this.commandOptions));
  /**
   * @see https://redis.io/commands/setrange
   * @see node_modules/@upstash/redis/docs/commands/string/setrange.mdx
   */
  setrange = (...args) => this.chain(new SetRangeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sinter
   * @see node_modules/@upstash/redis/docs/commands/set/sinter.mdx
   */
  sinter = (...args) => this.chain(new SInterCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sintercard
   */
  sintercard = (...args) => this.chain(new SInterCardCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sinterstore
   * @see node_modules/@upstash/redis/docs/commands/set/sinterstore.mdx
   */
  sinterstore = (...args) => this.chain(new SInterStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sismember
   * @see node_modules/@upstash/redis/docs/commands/set/sismember.mdx
   */
  sismember = (key, member) => this.chain(new SIsMemberCommand([key, member], this.commandOptions));
  /**
   * @see https://redis.io/commands/smembers
   * @see node_modules/@upstash/redis/docs/commands/set/smembers.mdx
   */
  smembers = (...args) => this.chain(new SMembersCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/smismember
   * @see node_modules/@upstash/redis/docs/commands/set/smismember.mdx
   */
  smismember = (key, members) => this.chain(new SMIsMemberCommand([key, members], this.commandOptions));
  /**
   * @see https://redis.io/commands/smove
   * @see node_modules/@upstash/redis/docs/commands/set/smove.mdx
   */
  smove = (source, destination, member) => this.chain(new SMoveCommand([source, destination, member], this.commandOptions));
  /**
   * @see https://redis.io/commands/spop
   * @see node_modules/@upstash/redis/docs/commands/set/spop.mdx
   */
  spop = (...args) => this.chain(new SPopCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/srandmember
   * @see node_modules/@upstash/redis/docs/commands/set/srandmember.mdx
   */
  srandmember = (...args) => this.chain(new SRandMemberCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/srem
   * @see node_modules/@upstash/redis/docs/commands/set/srem.mdx
   */
  srem = (key, ...members) => this.chain(new SRemCommand([key, ...members], this.commandOptions));
  /**
   * @see https://redis.io/commands/sscan
   * @see node_modules/@upstash/redis/docs/commands/set/sscan.mdx
   */
  sscan = (...args) => this.chain(new SScanCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/strlen
   * @see node_modules/@upstash/redis/docs/commands/string/strlen.mdx
   */
  strlen = (...args) => this.chain(new StrLenCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sunion
   * @see node_modules/@upstash/redis/docs/commands/set/sunion.mdx
   */
  sunion = (...args) => this.chain(new SUnionCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/sunionstore
   * @see node_modules/@upstash/redis/docs/commands/set/sunionstore.mdx
   */
  sunionstore = (...args) => this.chain(new SUnionStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/time
   */
  time = () => this.chain(new TimeCommand(this.commandOptions));
  /**
   * @see https://redis.io/commands/touch
   * @see node_modules/@upstash/redis/docs/commands/generic/touch.mdx
   */
  touch = (...args) => this.chain(new TouchCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/ttl
   * @see node_modules/@upstash/redis/docs/commands/generic/ttl.mdx
   */
  ttl = (...args) => this.chain(new TtlCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/type
   * @see node_modules/@upstash/redis/docs/commands/generic/type.mdx
   */
  type = (...args) => this.chain(new TypeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/unlink
   * @see node_modules/@upstash/redis/docs/commands/generic/unlink.mdx
   */
  unlink = (...args) => this.chain(new UnlinkCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zadd
   * @see node_modules/@upstash/redis/docs/commands/zset/zadd.mdx
   */
  zadd = (...args) => {
    if ("score" in args[1]) {
      return this.chain(
        new ZAddCommand([args[0], args[1], ...args.slice(2)], this.commandOptions)
      );
    }
    return this.chain(
      new ZAddCommand(
        [args[0], args[1], ...args.slice(2)],
        this.commandOptions
      )
    );
  };
  /**
   * @see https://redis.io/commands/xadd
   * @see node_modules/@upstash/redis/docs/commands/stream/xadd.mdx
   */
  xadd = (...args) => this.chain(new XAddCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xack
   * @see node_modules/@upstash/redis/docs/commands/stream/xack.mdx
   */
  xack = (...args) => this.chain(new XAckCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xackdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xackdel.mdx
   */
  xackdel = (...args) => this.chain(new XAckDelCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xdel.mdx
   */
  xdel = (...args) => this.chain(new XDelCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xdelex
   * @see node_modules/@upstash/redis/docs/commands/stream/xdelex.mdx
   */
  xdelex = (...args) => this.chain(new XDelExCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xgroup.mdx
   */
  xgroup = (...args) => this.chain(new XGroupCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xread
   * @see node_modules/@upstash/redis/docs/commands/stream/xread.mdx
   */
  xread = (...args) => this.chain(new XReadCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xreadgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xreadgroup.mdx
   */
  xreadgroup = (...args) => this.chain(new XReadGroupCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xinfo
   * @see node_modules/@upstash/redis/docs/commands/stream/xinfo.mdx
   */
  xinfo = (...args) => this.chain(new XInfoCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xlen
   * @see node_modules/@upstash/redis/docs/commands/stream/xlen.mdx
   */
  xlen = (...args) => this.chain(new XLenCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xpending
   * @see node_modules/@upstash/redis/docs/commands/stream/xpending.mdx
   */
  xpending = (...args) => this.chain(new XPendingCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xclaim.mdx
   */
  xclaim = (...args) => this.chain(new XClaimCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xautoclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xautoclaim.mdx
   */
  xautoclaim = (...args) => this.chain(new XAutoClaim(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xtrim
   * @see node_modules/@upstash/redis/docs/commands/stream/xtrim.mdx
   */
  xtrim = (...args) => this.chain(new XTrimCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, xrange returns [id, [field, value, ...]] entries instead,
   * such as [["1790341484470-0", ["text", "123"]]], and [] for a missing key.
   */
  xrange = (...args) => this.chain(new XRangeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/xrevrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrevrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, xrevrange returns [id, [field, value, ...]] entries instead,
   * such as [["1790341484470-0", ["text", "123"]]], and [] for a missing key.
   */
  xrevrange = (...args) => this.chain(new XRevRangeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zcard
   * @see node_modules/@upstash/redis/docs/commands/zset/zcard.mdx
   */
  zcard = (...args) => this.chain(new ZCardCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zcount.mdx
   */
  zcount = (...args) => this.chain(new ZCountCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zincrby
   * @see node_modules/@upstash/redis/docs/commands/zset/zincrby.mdx
   */
  zincrby = (key, increment, member) => this.chain(new ZIncrByCommand([key, increment, member], this.commandOptions));
  /**
   * @see https://redis.io/commands/zinterstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zinterstore.mdx
   */
  zinterstore = (...args) => this.chain(new ZInterStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zlexcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zlexcount.mdx
   */
  zlexcount = (...args) => this.chain(new ZLexCountCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zmscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zmscore.mdx
   */
  zmscore = (...args) => this.chain(new ZMScoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zpopmax
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmax.mdx
   */
  zpopmax = (...args) => this.chain(new ZPopMaxCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zpopmin
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmin.mdx
   */
  zpopmin = (...args) => this.chain(new ZPopMinCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zrange
   * @see node_modules/@upstash/redis/docs/commands/zset/zrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  zrange = (...args) => this.chain(new ZRangeCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrank.mdx
   */
  zrank = (key, member) => this.chain(new ZRankCommand([key, member], this.commandOptions));
  /**
   * @see https://redis.io/commands/zrem
   * @see node_modules/@upstash/redis/docs/commands/zset/zrem.mdx
   */
  zrem = (key, ...members) => this.chain(new ZRemCommand([key, ...members], this.commandOptions));
  /**
   * @see https://redis.io/commands/zremrangebylex
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebylex.mdx
   */
  zremrangebylex = (...args) => this.chain(new ZRemRangeByLexCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zremrangebyrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyrank.mdx
   */
  zremrangebyrank = (...args) => this.chain(new ZRemRangeByRankCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zremrangebyscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyscore.mdx
   */
  zremrangebyscore = (...args) => this.chain(new ZRemRangeByScoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zrevrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrevrank.mdx
   */
  zrevrank = (key, member) => this.chain(new ZRevRankCommand([key, member], this.commandOptions));
  /**
   * @see https://redis.io/commands/zscan
   * @see node_modules/@upstash/redis/docs/commands/zset/zscan.mdx
   */
  zscan = (...args) => this.chain(new ZScanCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zscore.mdx
   */
  zscore = (key, member) => this.chain(new ZScoreCommand([key, member], this.commandOptions));
  /**
   * @see https://redis.io/commands/zunionstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zunionstore.mdx
   */
  zunionstore = (...args) => this.chain(new ZUnionStoreCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/zunion
   */
  zunion = (...args) => this.chain(new ZUnionCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/?group=json
   */
  get json() {
    return {
      /**
       * @see https://redis.io/commands/json.arrappend
       * @see node_modules/@upstash/redis/docs/commands/json/arrappend.mdx
       */
      arrappend: (...args) => this.chain(new JsonArrAppendCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.arrindex
       * @see node_modules/@upstash/redis/docs/commands/json/arrindex.mdx
       */
      arrindex: (...args) => this.chain(new JsonArrIndexCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.arrinsert
       * @see node_modules/@upstash/redis/docs/commands/json/arrinsert.mdx
       */
      arrinsert: (...args) => this.chain(new JsonArrInsertCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.arrlen
       * @see node_modules/@upstash/redis/docs/commands/json/arrlen.mdx
       */
      arrlen: (...args) => this.chain(new JsonArrLenCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.arrpop
       * @see node_modules/@upstash/redis/docs/commands/json/arrpop.mdx
       */
      arrpop: (...args) => this.chain(new JsonArrPopCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.arrtrim
       * @see node_modules/@upstash/redis/docs/commands/json/arrtrim.mdx
       */
      arrtrim: (...args) => this.chain(new JsonArrTrimCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.clear
       * @see node_modules/@upstash/redis/docs/commands/json/clear.mdx
       */
      clear: (...args) => this.chain(new JsonClearCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.del
       * @see node_modules/@upstash/redis/docs/commands/json/del.mdx
       */
      del: (...args) => this.chain(new JsonDelCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.forget
       * @see node_modules/@upstash/redis/docs/commands/json/forget.mdx
       */
      forget: (...args) => this.chain(new JsonForgetCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.get
       * @see node_modules/@upstash/redis/docs/commands/json/get.mdx
       */
      get: (...args) => this.chain(new JsonGetCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.merge
       * @see node_modules/@upstash/redis/docs/commands/json/merge.mdx
       */
      merge: (...args) => this.chain(new JsonMergeCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.mget
       * @see node_modules/@upstash/redis/docs/commands/json/mget.mdx
       */
      mget: (...args) => this.chain(new JsonMGetCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.mset
       * @see node_modules/@upstash/redis/docs/commands/json/mset.mdx
       */
      mset: (...args) => this.chain(new JsonMSetCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.numincrby
       * @see node_modules/@upstash/redis/docs/commands/json/numincrby.mdx
       */
      numincrby: (...args) => this.chain(new JsonNumIncrByCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.nummultby
       * @see node_modules/@upstash/redis/docs/commands/json/nummultby.mdx
       */
      nummultby: (...args) => this.chain(new JsonNumMultByCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.objkeys
       * @see node_modules/@upstash/redis/docs/commands/json/objkeys.mdx
       */
      objkeys: (...args) => this.chain(new JsonObjKeysCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.objlen
       * @see node_modules/@upstash/redis/docs/commands/json/objlen.mdx
       */
      objlen: (...args) => this.chain(new JsonObjLenCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.resp
       */
      resp: (...args) => this.chain(new JsonRespCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.set
       * @see node_modules/@upstash/redis/docs/commands/json/set.mdx
       */
      set: (...args) => this.chain(new JsonSetCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.strappend
       * @see node_modules/@upstash/redis/docs/commands/json/strappend.mdx
       */
      strappend: (...args) => this.chain(new JsonStrAppendCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.strlen
       * @see node_modules/@upstash/redis/docs/commands/json/strlen.mdx
       */
      strlen: (...args) => this.chain(new JsonStrLenCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.toggle
       * @see node_modules/@upstash/redis/docs/commands/json/toggle.mdx
       */
      toggle: (...args) => this.chain(new JsonToggleCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/commands/json.type
       * @see node_modules/@upstash/redis/docs/commands/json/type.mdx
       */
      type: (...args) => this.chain(new JsonTypeCommand(args, this.commandOptions))
    };
  }
  get functions() {
    return {
      /**
       * @see https://redis.io/docs/latest/commands/function-load/
       * @see node_modules/@upstash/redis/docs/commands/functions/load.mdx
       */
      load: (...args) => this.chain(new FunctionLoadCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/docs/latest/commands/function-list/
       * @see node_modules/@upstash/redis/docs/commands/functions/list.mdx
       */
      list: (...args) => this.chain(new FunctionListCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/docs/latest/commands/function-delete/
       * @see node_modules/@upstash/redis/docs/commands/functions/delete.mdx
       */
      delete: (...args) => this.chain(new FunctionDeleteCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/docs/latest/commands/function-flush/
       * @see node_modules/@upstash/redis/docs/commands/functions/flush.mdx
       */
      flush: () => this.chain(new FunctionFlushCommand(this.commandOptions)),
      /**
       * @see https://redis.io/docs/latest/commands/function-stats/
       * @see node_modules/@upstash/redis/docs/commands/functions/stats.mdx
       */
      stats: () => this.chain(new FunctionStatsCommand(this.commandOptions)),
      /**
       * @see https://redis.io/docs/latest/commands/fcall/
       * @see node_modules/@upstash/redis/docs/commands/functions/call.mdx
       */
      call: (...args) => this.chain(new FCallCommand(args, this.commandOptions)),
      /**
       * @see https://redis.io/docs/latest/commands/fcall_ro/
       * @see node_modules/@upstash/redis/docs/commands/functions/call_ro.mdx
       */
      callRo: (...args) => this.chain(new FCallRoCommand(args, this.commandOptions))
    };
  }
};
var MAX_PIPELINE_SIZE = 1e3;
var READ_COMMANDS = /* @__PURE__ */ new Set([
  // Array
  "arcount",
  "arget",
  "argetrange",
  "argrep",
  "arinfo",
  "arlastitems",
  "arlen",
  "armget",
  "arnext",
  "arop",
  "arscan",
  // String
  "get",
  "getrange",
  "mget",
  "strlen",
  // Bit
  "bitcount",
  "bitpos",
  "getbit",
  // Hash
  "hexists",
  "hget",
  "hgetall",
  "hkeys",
  "hlen",
  "hmget",
  "hrandfield",
  "hscan",
  "hstrlen",
  "httl",
  "hvals",
  "hexpiretime",
  "hpexpiretime",
  "hpttl",
  // List
  "lindex",
  "llen",
  "lpos",
  "lrange",
  // Set
  "scard",
  "sdiff",
  "sinter",
  "sintercard",
  "sismember",
  "smembers",
  "smismember",
  "srandmember",
  "sscan",
  "sunion",
  // Sorted set
  "zcard",
  "zcount",
  "zlexcount",
  "zmscore",
  "zrange",
  "zrank",
  "zrevrank",
  "zscan",
  "zscore",
  "zunion",
  // Key metadata
  "exists",
  "type",
  "ttl",
  "pttl",
  "randomkey",
  "touch",
  // HyperLogLog
  "pfcount",
  // Stream
  "xinfo",
  "xlen",
  "xpending",
  "xrange",
  "xread",
  "xrevrange",
  // Geo
  "geodist",
  "geohash",
  "geopos",
  "geosearch",
  // Script / eval
  "scriptExists",
  "evalRo",
  "evalshaRo",
  // Utility
  "dbsize",
  "echo",
  "ping",
  "time",
  "scan",
  "keys",
  // JSON namespace
  "arrindex",
  "arrlen",
  "objkeys",
  "objlen",
  "resp",
  // Functions namespace
  "list",
  "stats",
  "callRo"
]);
var EXCLUDE_COMMANDS = /* @__PURE__ */ new Set([
  "scan",
  "keys",
  "flushdb",
  "flushall",
  "dbsize",
  "hscan",
  "hgetall",
  "hkeys",
  "lrange",
  "sscan",
  "smembers",
  "xrange",
  "xrevrange",
  "zscan",
  "zrange",
  "exec"
]);
function createAutoPipelineProxy(_redis, namespace = "root") {
  const redis = _redis;
  if (!redis.autoPipelineExecutor) {
    redis.autoPipelineExecutor = new AutoPipelineExecutor(redis);
  }
  return new Proxy(redis, {
    get: (redis2, command) => {
      if (command === "pipelineCounter") {
        return redis2.autoPipelineExecutor.pipelineCounter;
      }
      if (namespace === "root" && command === "json") {
        return createAutoPipelineProxy(redis2, "json");
      }
      if (namespace === "root" && command === "functions") {
        return createAutoPipelineProxy(redis2, "functions");
      }
      if (namespace === "root") {
        const commandInRedisButNotPipeline = command in redis2 && !(command in redis2.autoPipelineExecutor.pipeline);
        const isCommandExcluded = EXCLUDE_COMMANDS.has(command);
        if (commandInRedisButNotPipeline || isCommandExcluded) {
          return redis2[command];
        }
      }
      const pipeline = redis2.autoPipelineExecutor.pipeline;
      const targetFunction = namespace === "json" ? pipeline.json[command] : namespace === "functions" ? pipeline.functions[command] : pipeline[command];
      const isFunction = typeof targetFunction === "function";
      if (isFunction) {
        return (...args) => {
          const commandMode = READ_COMMANDS.has(command) ? "read" : "write";
          return redis2.autoPipelineExecutor.withAutoPipeline(commandMode, (pipeline2) => {
            const targetFunction2 = namespace === "json" ? pipeline2.json[command] : namespace === "functions" ? pipeline2.functions[command] : pipeline2[command];
            targetFunction2(...args);
          });
        };
      }
      return targetFunction;
    }
  });
}
var AutoPipelineExecutor = class {
  pipelinePromises = /* @__PURE__ */ new WeakMap();
  activeReadPipeline = null;
  activeWritePipeline = null;
  readIndex = 0;
  writeIndex = 0;
  redis;
  pipeline;
  // only to make sure that proxy can work
  pipelineCounter = 0;
  // to keep track of how many times a pipeline was executed
  constructor(redis) {
    this.redis = redis;
    this.pipeline = redis.pipeline();
  }
  async withAutoPipeline(commandMode, executeWithPipeline) {
    const isRead = commandMode === "read";
    const activePipeline = isRead ? this.activeReadPipeline : this.activeWritePipeline;
    const pipeline = activePipeline ?? this.redis.pipeline();
    executeWithPipeline(pipeline);
    if (!activePipeline) {
      if (isRead) {
        this.activeReadPipeline = pipeline;
        this.readIndex = 0;
      } else {
        this.activeWritePipeline = pipeline;
        this.writeIndex = 0;
      }
    }
    const index = isRead ? this.readIndex++ : this.writeIndex++;
    if (isRead && this.readIndex >= MAX_PIPELINE_SIZE) {
      this.activeReadPipeline = null;
    } else if (!isRead && this.writeIndex >= MAX_PIPELINE_SIZE) {
      this.activeWritePipeline = null;
    }
    const pipelineDone = this.deferExecution().then(() => {
      if (!this.pipelinePromises.has(pipeline)) {
        const pipelinePromise = pipeline.exec({ keepErrors: true });
        this.pipelineCounter += 1;
        this.pipelinePromises.set(pipeline, pipelinePromise);
        if (this.activeReadPipeline === pipeline) {
          this.activeReadPipeline = null;
        }
        if (this.activeWritePipeline === pipeline) {
          this.activeWritePipeline = null;
        }
      }
      return this.pipelinePromises.get(pipeline);
    });
    const results = await pipelineDone;
    const commandResult = results[index];
    if (commandResult.error) {
      throw new UpstashError(`Command failed: ${commandResult.error}`);
    }
    return commandResult.result;
  }
  async deferExecution() {
    await Promise.resolve();
    await Promise.resolve();
  }
};
var PSubscribeCommand = class extends Command {
  constructor(cmd, opts) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    };
    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["psubscribe", ...cmd],
      streamOptions: {
        isStreaming: true,
        onMessage: opts?.streamOptions?.onMessage,
        signal: opts?.streamOptions?.signal
      }
    });
  }
};
var Subscriber = class extends EventTarget {
  subscriptions;
  client;
  listeners;
  opts;
  constructor(client, channels, isPattern = false, opts) {
    super();
    this.client = client;
    this.subscriptions = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.opts = opts;
    for (const channel of channels) {
      if (isPattern) {
        this.subscribeToPattern(channel);
      } else {
        this.subscribeToChannel(channel);
      }
    }
  }
  subscribeToChannel(channel) {
    const controller = new AbortController();
    const command = new SubscribeCommand([channel], {
      streamOptions: {
        signal: controller.signal,
        onMessage: (data) => this.handleMessage(data, false)
      }
    });
    command.exec(this.client).catch((error) => {
      if (error.name !== "AbortError") {
        this.dispatchToListeners("error", error);
      }
    });
    this.subscriptions.set(channel, {
      command,
      controller,
      isPattern: false
    });
  }
  subscribeToPattern(pattern) {
    const controller = new AbortController();
    const command = new PSubscribeCommand([pattern], {
      streamOptions: {
        signal: controller.signal,
        onMessage: (data) => this.handleMessage(data, true)
      }
    });
    command.exec(this.client).catch((error) => {
      if (error.name !== "AbortError") {
        this.dispatchToListeners("error", error);
      }
    });
    this.subscriptions.set(pattern, {
      command,
      controller,
      isPattern: true
    });
  }
  handleMessage(data, isPattern) {
    const messageData = data.replace(/^data:\s*/, "");
    const firstCommaIndex = messageData.indexOf(",");
    const secondCommaIndex = messageData.indexOf(",", firstCommaIndex + 1);
    const thirdCommaIndex = isPattern ? messageData.indexOf(",", secondCommaIndex + 1) : -1;
    if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
      const type = messageData.slice(0, firstCommaIndex);
      if (isPattern && type === "pmessage" && thirdCommaIndex !== -1) {
        const pattern = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
        const channel = messageData.slice(secondCommaIndex + 1, thirdCommaIndex);
        const messageStr = messageData.slice(thirdCommaIndex + 1);
        try {
          const message = this.opts?.automaticDeserialization === false ? messageStr : parseWithTryCatch(messageStr);
          this.dispatchToListeners("pmessage", { pattern, channel, message });
          this.dispatchToListeners(`pmessage:${pattern}`, { pattern, channel, message });
        } catch (error) {
          this.dispatchToListeners("error", new Error(`Failed to parse message: ${error}`));
        }
      } else {
        const channel = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
        const messageStr = messageData.slice(secondCommaIndex + 1);
        try {
          if (type === "subscribe" || type === "psubscribe" || type === "unsubscribe" || type === "punsubscribe") {
            const count = Number.parseInt(messageStr);
            this.dispatchToListeners(type, count);
          } else {
            const message = this.opts?.automaticDeserialization === false ? messageStr : parseWithTryCatch(messageStr);
            this.dispatchToListeners(type, { channel, message });
            this.dispatchToListeners(`${type}:${channel}`, { channel, message });
          }
        } catch (error) {
          this.dispatchToListeners("error", new Error(`Failed to parse message: ${error}`));
        }
      }
    }
  }
  dispatchToListeners(type, data) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      for (const listener of listeners) {
        listener(data);
      }
    }
  }
  on(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, /* @__PURE__ */ new Set());
    }
    this.listeners.get(type)?.add(listener);
  }
  removeAllListeners() {
    this.listeners.clear();
  }
  async unsubscribe(channels) {
    if (channels) {
      for (const channel of channels) {
        const subscription = this.subscriptions.get(channel);
        if (subscription) {
          try {
            subscription.controller.abort();
          } catch {
          }
          this.subscriptions.delete(channel);
        }
      }
    } else {
      for (const subscription of this.subscriptions.values()) {
        try {
          subscription.controller.abort();
        } catch {
        }
      }
      this.subscriptions.clear();
      this.removeAllListeners();
    }
  }
  getSubscribedChannels() {
    return [...this.subscriptions.keys()];
  }
};
var SubscribeCommand = class extends Command {
  constructor(cmd, opts) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    };
    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["subscribe", ...cmd],
      streamOptions: {
        isStreaming: true,
        onMessage: opts?.streamOptions?.onMessage,
        signal: opts?.streamOptions?.signal
      }
    });
  }
};
var parseWithTryCatch = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};
var Script = class {
  script;
  /**
   * @deprecated This property is initialized to an empty string and will be set in the init method
   * asynchronously. Do not use this property immidiately after the constructor.
   *
   * This property is only exposed for backwards compatibility and will be removed in the
   * future major release.
   */
  sha1;
  initPromise;
  redis;
  constructor(redis, script) {
    this.redis = redis;
    this.script = script;
    this.sha1 = "";
    void this.init(script);
  }
  /**
   * Initialize the script by computing its SHA-1 hash.
   */
  init(script) {
    if (!this.initPromise) {
      this.initPromise = this.digest(script).then((sha1) => {
        this.sha1 = sha1;
      });
    }
    return this.initPromise;
  }
  /**
   * Send an `EVAL` command to redis.
   */
  async eval(keys, args) {
    await this.init(this.script);
    return await this.redis.eval(this.script, keys, args);
  }
  /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA`.
   */
  async evalsha(keys, args) {
    await this.init(this.script);
    return await this.redis.evalsha(this.sha1, keys, args);
  }
  /**
   * Optimistically try to run `EVALSHA` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL`.
   *
   * Following calls will be able to use the cached script
   */
  async exec(keys, args) {
    await this.init(this.script);
    const res = await this.redis.evalsha(this.sha1, keys, args).catch(async (error) => {
      if (error instanceof Error && error.message.toLowerCase().includes("noscript")) {
        return await this.redis.eval(this.script, keys, args);
      }
      throw error;
    });
    return res;
  }
  /**
   * Compute the sha1 hash of the script and return its hex representation.
   */
  async digest(s) {
    const data = new TextEncoder().encode(s);
    const hashBuffer = await subtle.digest("SHA-1", data);
    const hashArray = [...new Uint8Array(hashBuffer)];
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
};
var ScriptRO = class {
  script;
  /**
   * @deprecated This property is initialized to an empty string and will be set in the init method
   * asynchronously. Do not use this property immidiately after the constructor.
   *
   * This property is only exposed for backwards compatibility and will be removed in the
   * future major release.
   */
  sha1;
  initPromise;
  redis;
  constructor(redis, script) {
    this.redis = redis;
    this.sha1 = "";
    this.script = script;
    void this.init(script);
  }
  init(script) {
    if (!this.initPromise) {
      this.initPromise = this.digest(script).then((sha1) => {
        this.sha1 = sha1;
      });
    }
    return this.initPromise;
  }
  /**
   * Send an `EVAL_RO` command to redis.
   */
  async evalRo(keys, args) {
    await this.init(this.script);
    return await this.redis.evalRo(this.script, keys, args);
  }
  /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA_RO`.
   */
  async evalshaRo(keys, args) {
    await this.init(this.script);
    return await this.redis.evalshaRo(this.sha1, keys, args);
  }
  /**
   * Optimistically try to run `EVALSHA_RO` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL_RO`.
   *
   * Following calls will be able to use the cached script
   */
  async exec(keys, args) {
    await this.init(this.script);
    const res = await this.redis.evalshaRo(this.sha1, keys, args).catch(async (error) => {
      if (error instanceof Error && error.message.toLowerCase().includes("noscript")) {
        return await this.redis.evalRo(this.script, keys, args);
      }
      throw error;
    });
    return res;
  }
  /**
   * Compute the sha1 hash of the script and return its hex representation.
   */
  async digest(s) {
    const data = new TextEncoder().encode(s);
    const hashBuffer = await subtle.digest("SHA-1", data);
    const hashArray = [...new Uint8Array(hashBuffer)];
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
};
var Redis = class {
  client;
  opts;
  enableTelemetry;
  enableAutoPipelining;
  /**
   * Create a new redis client
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
  constructor(client, opts) {
    this.client = client;
    this.opts = opts;
    this.enableTelemetry = opts?.enableTelemetry ?? true;
    if (opts?.readYourWrites === false) {
      this.client.readYourWrites = false;
    }
    this.enableAutoPipelining = opts?.enableAutoPipelining ?? true;
  }
  get readYourWritesSyncToken() {
    return this.client.upstashSyncToken;
  }
  set readYourWritesSyncToken(session) {
    this.client.upstashSyncToken = session;
  }
  get json() {
    return {
      /**
       * @see https://redis.io/commands/json.arrappend
       * @see node_modules/@upstash/redis/docs/commands/json/arrappend.mdx
       */
      arrappend: (...args) => new JsonArrAppendCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.arrindex
       * @see node_modules/@upstash/redis/docs/commands/json/arrindex.mdx
       */
      arrindex: (...args) => new JsonArrIndexCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.arrinsert
       * @see node_modules/@upstash/redis/docs/commands/json/arrinsert.mdx
       */
      arrinsert: (...args) => new JsonArrInsertCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.arrlen
       * @see node_modules/@upstash/redis/docs/commands/json/arrlen.mdx
       */
      arrlen: (...args) => new JsonArrLenCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.arrpop
       * @see node_modules/@upstash/redis/docs/commands/json/arrpop.mdx
       */
      arrpop: (...args) => new JsonArrPopCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.arrtrim
       * @see node_modules/@upstash/redis/docs/commands/json/arrtrim.mdx
       */
      arrtrim: (...args) => new JsonArrTrimCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.clear
       * @see node_modules/@upstash/redis/docs/commands/json/clear.mdx
       */
      clear: (...args) => new JsonClearCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.del
       * @see node_modules/@upstash/redis/docs/commands/json/del.mdx
       */
      del: (...args) => new JsonDelCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.forget
       * @see node_modules/@upstash/redis/docs/commands/json/forget.mdx
       */
      forget: (...args) => new JsonForgetCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.get
       * @see node_modules/@upstash/redis/docs/commands/json/get.mdx
       */
      get: (...args) => new JsonGetCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.merge
       * @see node_modules/@upstash/redis/docs/commands/json/merge.mdx
       */
      merge: (...args) => new JsonMergeCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.mget
       * @see node_modules/@upstash/redis/docs/commands/json/mget.mdx
       */
      mget: (...args) => new JsonMGetCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.mset
       * @see node_modules/@upstash/redis/docs/commands/json/mset.mdx
       */
      mset: (...args) => new JsonMSetCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.numincrby
       * @see node_modules/@upstash/redis/docs/commands/json/numincrby.mdx
       */
      numincrby: (...args) => new JsonNumIncrByCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.nummultby
       * @see node_modules/@upstash/redis/docs/commands/json/nummultby.mdx
       */
      nummultby: (...args) => new JsonNumMultByCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.objkeys
       * @see node_modules/@upstash/redis/docs/commands/json/objkeys.mdx
       */
      objkeys: (...args) => new JsonObjKeysCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.objlen
       * @see node_modules/@upstash/redis/docs/commands/json/objlen.mdx
       */
      objlen: (...args) => new JsonObjLenCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.resp
       */
      resp: (...args) => new JsonRespCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.set
       * @see node_modules/@upstash/redis/docs/commands/json/set.mdx
       */
      set: (...args) => new JsonSetCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.strappend
       * @see node_modules/@upstash/redis/docs/commands/json/strappend.mdx
       */
      strappend: (...args) => new JsonStrAppendCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.strlen
       * @see node_modules/@upstash/redis/docs/commands/json/strlen.mdx
       */
      strlen: (...args) => new JsonStrLenCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.toggle
       * @see node_modules/@upstash/redis/docs/commands/json/toggle.mdx
       */
      toggle: (...args) => new JsonToggleCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/commands/json.type
       * @see node_modules/@upstash/redis/docs/commands/json/type.mdx
       */
      type: (...args) => new JsonTypeCommand(args, this.opts).exec(this.client)
    };
  }
  get functions() {
    return {
      /**
       * @see https://redis.io/docs/latest/commands/function-load/
       * @see node_modules/@upstash/redis/docs/commands/functions/load.mdx
       */
      load: (...args) => new FunctionLoadCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/docs/latest/commands/function-list/
       * @see node_modules/@upstash/redis/docs/commands/functions/list.mdx
       */
      list: (...args) => new FunctionListCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/docs/latest/commands/function-delete/
       * @see node_modules/@upstash/redis/docs/commands/functions/delete.mdx
       */
      delete: (...args) => new FunctionDeleteCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/docs/latest/commands/function-flush/
       * @see node_modules/@upstash/redis/docs/commands/functions/flush.mdx
       */
      flush: () => new FunctionFlushCommand(this.opts).exec(this.client),
      /**
       * @see https://redis.io/docs/latest/commands/function-stats/
       * @see node_modules/@upstash/redis/docs/commands/functions/stats.mdx
       *
       * Note: `running_script` field is not supported and therefore not included in the type.
       */
      stats: () => new FunctionStatsCommand(this.opts).exec(this.client),
      /**
       * @see https://redis.io/docs/latest/commands/fcall/
       * @see node_modules/@upstash/redis/docs/commands/functions/call.mdx
       */
      call: (...args) => new FCallCommand(args, this.opts).exec(this.client),
      /**
       * @see https://redis.io/docs/latest/commands/fcall_ro/
       * @see node_modules/@upstash/redis/docs/commands/functions/call_ro.mdx
       */
      callRo: (...args) => new FCallRoCommand(args, this.opts).exec(this.client)
    };
  }
  /**
   * Wrap a new middleware around the HTTP client.
   */
  use = (middleware) => {
    const makeRequest = this.client.request.bind(this.client);
    this.client.request = (req) => middleware(req, makeRequest);
  };
  /**
   * Technically this is not private, we can hide it from intellisense by doing this
   */
  addTelemetry = (telemetry) => {
    if (!this.enableTelemetry) {
      return;
    }
    try {
      this.client.mergeTelemetry(telemetry);
    } catch {
    }
  };
  /**
   * Creates a new script.
   *
   * Scripts offer the ability to optimistically try to execute a script without having to send the
   * entire script to the server. If the script is loaded on the server, it tries again by sending
   * the entire script. Afterwards, the script is cached on the server.
   *
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   *
   * @param script - The script to create
   * @param opts - Optional options to pass to the script `{ readonly?: boolean }`
   * @returns A new script
   *
   * @example
   * ```ts
   * const redis = new Redis({...})
   *
   * const script = redis.createScript<string>("return ARGV[1];")
   * const arg1 = await script.eval([], ["Hello World"])
   * expect(arg1, "Hello World")
   * ```
   * @example
   * ```ts
   * const redis = new Redis({...})
   *
   * const script = redis.createScript<string>("return ARGV[1];", { readonly: true })
   * const arg1 = await script.evalRo([], ["Hello World"])
   * expect(arg1, "Hello World")
   * ```
   */
  createScript(script, opts) {
    return opts?.readonly ? new ScriptRO(this, script) : new Script(this, script);
  }
  get search() {
    return {
      createIndex: (params) => {
        return createIndex(this.client, params);
      },
      index: (params) => {
        return initIndex(this.client, params);
      },
      alias: {
        list: () => {
          return listAliases(this.client);
        },
        add: ({ indexName, alias }) => {
          return addAlias(this.client, { indexName, alias });
        },
        delete: ({ alias }) => {
          return delAlias(this.client, { alias });
        }
      }
    };
  }
  /**
   * Vector index commands.
   *
   * @example
   * ```typescript
   * const index = await redis.vector.createIndex({ name: "docs", dimension: 3, metric: "COSINE" });
   * await index.add("doc-1", [0.1, 0.2, 0.3]);
   * const hits = await index.query({ vector: [0.1, 0.2, 0.3], topK: 5 });
   * ```
   */
  get vector() {
    return {
      /**
       * Creates a vector index and returns a handle to it.
       */
      createIndex: (params) => {
        return createVectorIndex(this.client, params, this.opts);
      },
      /**
       * Returns a handle to an existing vector index without sending any command.
       */
      index: (name) => {
        return initVectorIndex(this.client, name, this.opts);
      }
    };
  }
  /**
   * Create a new pipeline that allows you to send requests in bulk.
   *
   * @see {@link Pipeline}
   */
  pipeline = () => new Pipeline({
    client: this.client,
    commandOptions: this.opts,
    multiExec: false
  });
  autoPipeline = () => {
    return createAutoPipelineProxy(this);
  };
  /**
   * Create a new transaction to allow executing multiple steps atomically.
   *
   * All the commands in a transaction are serialized and executed sequentially. A request sent by
   * another client will never be served in the middle of the execution of a Redis Transaction. This
   * guarantees that the commands are executed as a single isolated operation.
   *
   * @see {@link Pipeline}
   */
  multi = () => new Pipeline({
    client: this.client,
    commandOptions: this.opts,
    multiExec: true
  });
  /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [0, 1]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */
  bitfield = (...args) => new BitFieldCommand(args, this.client, this.opts);
  /**
   * @see https://redis.io/commands/append
   * @see node_modules/@upstash/redis/docs/commands/string/append.mdx
   */
  append = (...args) => new AppendCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arcount
   * @see node_modules/@upstash/redis/docs/commands/array/arcount.mdx
   */
  arcount = (...args) => new ArCountCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/ardel
   * @see node_modules/@upstash/redis/docs/commands/array/ardel.mdx
   */
  ardel = (...args) => new ArDelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/ardelrange
   * @see node_modules/@upstash/redis/docs/commands/array/ardelrange.mdx
   */
  ardelrange = (...args) => new ArDelRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arget
   * @see node_modules/@upstash/redis/docs/commands/array/arget.mdx
   */
  arget = (...args) => new ArGetCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/argetrange
   * @see node_modules/@upstash/redis/docs/commands/array/argetrange.mdx
   */
  argetrange = (...args) => new ArGetRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/argrep
   * @see node_modules/@upstash/redis/docs/commands/array/argrep.mdx
   */
  argrep = (key, start, end, opts) => new ArGrepCommand([key, start, end, opts], this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arinfo
   * @see node_modules/@upstash/redis/docs/commands/array/arinfo.mdx
   */
  arinfo = (...args) => new ArInfoCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arinsert
   * @see node_modules/@upstash/redis/docs/commands/array/arinsert.mdx
   */
  arinsert = (key, ...values) => new ArInsertCommand([key, ...values], this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arlastitems
   * @see node_modules/@upstash/redis/docs/commands/array/arlastitems.mdx
   */
  arlastitems = (...args) => new ArLastItemsCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arlen
   * @see node_modules/@upstash/redis/docs/commands/array/arlen.mdx
   */
  arlen = (...args) => new ArLenCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/armget
   * @see node_modules/@upstash/redis/docs/commands/array/armget.mdx
   */
  armget = (...args) => new ArMGetCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/armset
   * @see node_modules/@upstash/redis/docs/commands/array/armset.mdx
   */
  armset = (key, values) => new ArMSetCommand([key, values], this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arnext
   * @see node_modules/@upstash/redis/docs/commands/array/arnext.mdx
   */
  arnext = (...args) => new ArNextCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arop
   * @see node_modules/@upstash/redis/docs/commands/array/arop.mdx
   */
  arop = (key, start, end, operation) => new ArOpCommand([key, start, end, operation], this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arring
   * @see node_modules/@upstash/redis/docs/commands/array/arring.mdx
   */
  arring = (key, size, ...values) => new ArRingCommand([key, size, ...values], this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arscan
   * @see node_modules/@upstash/redis/docs/commands/array/arscan.mdx
   */
  arscan = (...args) => new ArScanCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arseek
   * @see node_modules/@upstash/redis/docs/commands/array/arseek.mdx
   */
  arseek = (...args) => new ArSeekCommand(args, this.opts).exec(this.client);
  /**
   * @see https://upstash.com/docs/redis/commands/array/arset
   * @see node_modules/@upstash/redis/docs/commands/array/arset.mdx
   */
  arset = (key, index, ...values) => new ArSetCommand([key, index, ...values], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/bitcount
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitcount.mdx
   */
  bitcount = (...args) => new BitCountCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/bitop
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitop.mdx
   */
  bitop = (op, destinationKey, sourceKey, ...sourceKeys) => new BitOpCommand([op, destinationKey, sourceKey, ...sourceKeys], this.opts).exec(
    this.client
  );
  /**
   * @see https://redis.io/commands/bitpos
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitpos.mdx
   */
  bitpos = (...args) => new BitPosCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/client-setinfo
   * @see node_modules/@upstash/redis/docs/commands/connection/client_setinfo.mdx
   */
  clientSetinfo = (...args) => new ClientSetInfoCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/copy
   */
  copy = (...args) => new CopyCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/dbsize
   * @see node_modules/@upstash/redis/docs/commands/server/dbsize.mdx
   */
  dbsize = () => new DBSizeCommand(this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/decr
   * @see node_modules/@upstash/redis/docs/commands/string/decr.mdx
   */
  decr = (...args) => new DecrCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/decrby
   * @see node_modules/@upstash/redis/docs/commands/string/decrby.mdx
   */
  decrby = (...args) => new DecrByCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/del
   * @see node_modules/@upstash/redis/docs/commands/generic/del.mdx
   */
  del = (...args) => new DelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/echo
   * @see node_modules/@upstash/redis/docs/commands/auth/echo.mdx
   */
  echo = (...args) => new EchoCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/eval_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval_ro.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  evalRo = (...args) => new EvalROCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/eval
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  eval = (...args) => new EvalCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/evalsha_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha_ro.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  evalshaRo = (...args) => new EvalshaROCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/evalsha
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  evalsha = (...args) => new EvalshaCommand(args, this.opts).exec(this.client);
  /**
   * Generic method to execute any Redis command.
   */
  exec = (args) => new ExecCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/exists
   * @see node_modules/@upstash/redis/docs/commands/generic/exists.mdx
   */
  exists = (...args) => new ExistsCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/expire
   * @see node_modules/@upstash/redis/docs/commands/generic/expire.mdx
   */
  expire = (...args) => new ExpireCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/expireat
   * @see node_modules/@upstash/redis/docs/commands/generic/expireat.mdx
   */
  expireat = (...args) => new ExpireAtCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/flushall
   * @see node_modules/@upstash/redis/docs/commands/server/flushall.mdx
   */
  flushall = (args) => new FlushAllCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/flushdb
   * @see node_modules/@upstash/redis/docs/commands/server/flushdb.mdx
   */
  flushdb = (...args) => new FlushDBCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/geoadd
   */
  geoadd = (...args) => new GeoAddCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/geopos
   */
  geopos = (...args) => new GeoPosCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/geodist
   */
  geodist = (...args) => new GeoDistCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/geohash
   */
  geohash = (...args) => new GeoHashCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/geosearch
   */
  geosearch = (...args) => new GeoSearchCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/geosearchstore
   */
  geosearchstore = (...args) => new GeoSearchStoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/get
   * @see node_modules/@upstash/redis/docs/commands/string/get.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  get = (...args) => new GetCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/getbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/getbit.mdx
   */
  getbit = (...args) => new GetBitCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/getdel
   * @see node_modules/@upstash/redis/docs/commands/string/getdel.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  getdel = (...args) => new GetDelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/getex
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  getex = (...args) => new GetExCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/getrange
   * @see node_modules/@upstash/redis/docs/commands/string/getrange.mdx
   */
  getrange = (...args) => new GetRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/getset
   * @see node_modules/@upstash/redis/docs/commands/string/getset.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  getset = (key, value) => new GetSetCommand([key, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hdel.mdx
   */
  hdel = (...args) => new HDelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hexists
   * @see node_modules/@upstash/redis/docs/commands/hash/hexists.mdx
   */
  hexists = (...args) => new HExistsCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpire.mdx
   */
  hexpire = (...args) => new HExpireCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpireat.mdx
   */
  hexpireat = (...args) => new HExpireAtCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpiretime.mdx
   */
  hexpiretime = (...args) => new HExpireTimeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/httl
   * @see node_modules/@upstash/redis/docs/commands/hash/httl.mdx
   */
  httl = (...args) => new HTtlCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hpexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpire.mdx
   */
  hpexpire = (...args) => new HPExpireCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hpexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpireat.mdx
   */
  hpexpireat = (...args) => new HPExpireAtCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hpexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpiretime.mdx
   */
  hpexpiretime = (...args) => new HPExpireTimeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hpttl
   * @see node_modules/@upstash/redis/docs/commands/hash/hpttl.mdx
   */
  hpttl = (...args) => new HPTtlCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hpersist
   * @see node_modules/@upstash/redis/docs/commands/hash/hpersist.mdx
   */
  hpersist = (...args) => new HPersistCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hget
   * @see node_modules/@upstash/redis/docs/commands/hash/hget.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  hget = (...args) => new HGetCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hgetall
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetall.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hgetall returns a flat array instead, such as
   * ["text", "123", "version", "1"], and [] for a missing key.
   */
  hgetall = (...args) => new HGetAllCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hgetdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetdel.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hgetdel returns an array of values in field order instead,
   * such as ["123", null], with null for each field when the key is missing.
   */
  hgetdel = (...args) => new HGetDelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hgetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetex.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hgetex returns an array of values in field order instead,
   * such as ["123", null], with null for each field when the key is missing.
   */
  hgetex = (...args) => new HGetExCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hincrby
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrby.mdx
   */
  hincrby = (...args) => new HIncrByCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hincrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrbyfloat.mdx
   */
  hincrbyfloat = (...args) => new HIncrByFloatCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hkeys
   * @see node_modules/@upstash/redis/docs/commands/hash/hkeys.mdx
   */
  hkeys = (...args) => new HKeysCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hlen.mdx
   */
  hlen = (...args) => new HLenCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hmget
   * @see node_modules/@upstash/redis/docs/commands/hash/hmget.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, hmget returns an array of values in field order instead,
   * such as ["123", null], with null for each field when the key is missing.
   */
  hmget = (...args) => new HMGetCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = (key, kv) => new HMSetCommand([key, kv], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hrandfield
   * @see node_modules/@upstash/redis/docs/commands/hash/hrandfield.mdx
   */
  hrandfield = (key, count, withValues) => new HRandFieldCommand([key, count, withValues], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hscan
   * @see node_modules/@upstash/redis/docs/commands/hash/hscan.mdx
   */
  hscan = (...args) => new HScanCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hset
   * @see node_modules/@upstash/redis/docs/commands/hash/hset.mdx
   */
  hset = (key, kv) => new HSetCommand([key, kv], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hsetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetex.mdx
   */
  hsetex = (...args) => new HSetExCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hsetnx
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetnx.mdx
   */
  hsetnx = (key, field, value) => new HSetNXCommand([key, field, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hstrlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hstrlen.mdx
   */
  hstrlen = (...args) => new HStrLenCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/hvals
   * @see node_modules/@upstash/redis/docs/commands/hash/hvals.mdx
   */
  hvals = (...args) => new HValsCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/incr
   * @see node_modules/@upstash/redis/docs/commands/string/incr.mdx
   */
  incr = (...args) => new IncrCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/incrby
   * @see node_modules/@upstash/redis/docs/commands/string/incrby.mdx
   */
  incrby = (...args) => new IncrByCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/incrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/string/incrbyfloat.mdx
   */
  incrbyfloat = (...args) => new IncrByFloatCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/keys
   * @see node_modules/@upstash/redis/docs/commands/generic/keys.mdx
   */
  keys = (...args) => new KeysCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lindex
   * @see node_modules/@upstash/redis/docs/commands/list/lindex.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  lindex = (...args) => new LIndexCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/linsert
   * @see node_modules/@upstash/redis/docs/commands/list/linsert.mdx
   */
  linsert = (key, direction, pivot, value) => new LInsertCommand([key, direction, pivot, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/llen
   * @see node_modules/@upstash/redis/docs/commands/list/llen.mdx
   */
  llen = (...args) => new LLenCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lmove
   * @see node_modules/@upstash/redis/docs/commands/list/lmove.mdx
   */
  lmove = (...args) => new LMoveCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lpop
   * @see node_modules/@upstash/redis/docs/commands/list/lpop.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  lpop = (...args) => new LPopCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lmpop
   */
  lmpop = (...args) => new LmPopCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lpos
   * @see node_modules/@upstash/redis/docs/commands/list/lpos.mdx
   */
  lpos = (...args) => new LPosCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lpush
   * @see node_modules/@upstash/redis/docs/commands/list/lpush.mdx
   */
  lpush = (key, ...elements) => new LPushCommand([key, ...elements], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lpushx
   * @see node_modules/@upstash/redis/docs/commands/list/lpushx.mdx
   */
  lpushx = (key, ...elements) => new LPushXCommand([key, ...elements], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lrange
   * @see node_modules/@upstash/redis/docs/commands/list/lrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  lrange = (...args) => new LRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lrem
   * @see node_modules/@upstash/redis/docs/commands/list/lrem.mdx
   */
  lrem = (key, count, value) => new LRemCommand([key, count, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/lset
   * @see node_modules/@upstash/redis/docs/commands/list/lset.mdx
   */
  lset = (key, index, value) => new LSetCommand([key, index, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/ltrim
   * @see node_modules/@upstash/redis/docs/commands/list/ltrim.mdx
   */
  ltrim = (...args) => new LTrimCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/mget
   * @see node_modules/@upstash/redis/docs/commands/string/mget.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  mget = (...args) => new MGetCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/mset
   * @see node_modules/@upstash/redis/docs/commands/string/mset.mdx
   */
  mset = (kv) => new MSetCommand([kv], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/msetnx
   * @see node_modules/@upstash/redis/docs/commands/string/msetnx.mdx
   */
  msetnx = (kv) => new MSetNXCommand([kv], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/persist
   * @see node_modules/@upstash/redis/docs/commands/generic/persist.mdx
   */
  persist = (...args) => new PersistCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/pexpire
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpire.mdx
   */
  pexpire = (...args) => new PExpireCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/pexpireat
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpireat.mdx
   */
  pexpireat = (...args) => new PExpireAtCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/pfadd
   */
  pfadd = (...args) => new PfAddCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/pfcount
   */
  pfcount = (...args) => new PfCountCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/pfmerge
   */
  pfmerge = (...args) => new PfMergeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/ping
   * @see node_modules/@upstash/redis/docs/commands/auth/ping.mdx
   */
  ping = (args) => new PingCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = (key, ttl, value) => new PSetEXCommand([key, ttl, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/psubscribe
   * @see node_modules/@upstash/redis/docs/commands/pubsub/psubscribe.mdx
   * Messages are JSON-parsed automatically: a published "123" arrives as the number 123. Unlike
   * subscribe, a message that is not valid JSON (such as "hello") never reaches the listener and
   * emits an "error" event instead. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  psubscribe = (patterns) => {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
    return new Subscriber(this.client, patternArray, true, this.opts);
  };
  /**
   * @see https://redis.io/commands/pttl
   * @see node_modules/@upstash/redis/docs/commands/generic/pttl.mdx
   */
  pttl = (...args) => new PTtlCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/publish
   * @see node_modules/@upstash/redis/docs/commands/pubsub/publish.mdx
   */
  publish = (...args) => new PublishCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/randomkey
   * @see node_modules/@upstash/redis/docs/commands/generic/randomkey.mdx
   */
  randomkey = () => new RandomKeyCommand().exec(this.client);
  /**
   * @see https://redis.io/commands/rename
   * @see node_modules/@upstash/redis/docs/commands/generic/rename.mdx
   */
  rename = (...args) => new RenameCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/renamenx
   * @see node_modules/@upstash/redis/docs/commands/generic/renamenx.mdx
   */
  renamenx = (...args) => new RenameNXCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/rpop
   * @see node_modules/@upstash/redis/docs/commands/list/rpop.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  rpop = (...args) => new RPopCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/rpush
   * @see node_modules/@upstash/redis/docs/commands/list/rpush.mdx
   */
  rpush = (key, ...elements) => new RPushCommand([key, ...elements], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/rpushx
   * @see node_modules/@upstash/redis/docs/commands/list/rpushx.mdx
   */
  rpushx = (key, ...elements) => new RPushXCommand([key, ...elements], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sadd
   * @see node_modules/@upstash/redis/docs/commands/set/sadd.mdx
   */
  sadd = (key, member, ...members) => new SAddCommand([key, member, ...members], this.opts).exec(this.client);
  scan(cursor, opts) {
    return new ScanCommand([cursor, opts], this.opts).exec(this.client);
  }
  /**
   * @see https://redis.io/commands/scard
   * @see node_modules/@upstash/redis/docs/commands/set/scard.mdx
   */
  scard = (...args) => new SCardCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/script-exists
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_exists.mdx
   */
  scriptExists = (...args) => new ScriptExistsCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/script-flush
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_flush.mdx
   */
  scriptFlush = (...args) => new ScriptFlushCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/script-load
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_load.mdx
   */
  scriptLoad = (...args) => new ScriptLoadCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sdiff
   * @see node_modules/@upstash/redis/docs/commands/set/sdiff.mdx
   */
  sdiff = (...args) => new SDiffCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sdiffstore
   * @see node_modules/@upstash/redis/docs/commands/set/sdiffstore.mdx
   */
  sdiffstore = (...args) => new SDiffStoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/set
   * @see node_modules/@upstash/redis/docs/commands/string/set.mdx
   */
  set = (key, value, opts) => new SetCommand([key, value, opts], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/setbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/setbit.mdx
   */
  setbit = (...args) => new SetBitCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/setex
   */
  setex = (key, ttl, value) => new SetExCommand([key, ttl, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = (key, value) => new SetNxCommand([key, value], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/setrange
   * @see node_modules/@upstash/redis/docs/commands/string/setrange.mdx
   */
  setrange = (...args) => new SetRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sinter
   * @see node_modules/@upstash/redis/docs/commands/set/sinter.mdx
   */
  sinter = (...args) => new SInterCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sintercard
   */
  sintercard = (...args) => new SInterCardCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sinterstore
   * @see node_modules/@upstash/redis/docs/commands/set/sinterstore.mdx
   */
  sinterstore = (...args) => new SInterStoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sismember
   * @see node_modules/@upstash/redis/docs/commands/set/sismember.mdx
   */
  sismember = (key, member) => new SIsMemberCommand([key, member], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/smismember
   * @see node_modules/@upstash/redis/docs/commands/set/smismember.mdx
   */
  smismember = (key, members) => new SMIsMemberCommand([key, members], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/smembers
   * @see node_modules/@upstash/redis/docs/commands/set/smembers.mdx
   */
  smembers = (...args) => new SMembersCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/smove
   * @see node_modules/@upstash/redis/docs/commands/set/smove.mdx
   */
  smove = (source, destination, member) => new SMoveCommand([source, destination, member], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/spop
   * @see node_modules/@upstash/redis/docs/commands/set/spop.mdx
   */
  spop = (...args) => new SPopCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/srandmember
   * @see node_modules/@upstash/redis/docs/commands/set/srandmember.mdx
   */
  srandmember = (...args) => new SRandMemberCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/srem
   * @see node_modules/@upstash/redis/docs/commands/set/srem.mdx
   */
  srem = (key, ...members) => new SRemCommand([key, ...members], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sscan
   * @see node_modules/@upstash/redis/docs/commands/set/sscan.mdx
   */
  sscan = (...args) => new SScanCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/strlen
   * @see node_modules/@upstash/redis/docs/commands/string/strlen.mdx
   */
  strlen = (...args) => new StrLenCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/subscribe
   * @see node_modules/@upstash/redis/docs/commands/pubsub/subscribe.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  subscribe = (channels) => {
    const channelArray = Array.isArray(channels) ? channels : [channels];
    return new Subscriber(this.client, channelArray, false, this.opts);
  };
  /**
   * @see https://redis.io/commands/sunion
   * @see node_modules/@upstash/redis/docs/commands/set/sunion.mdx
   */
  sunion = (...args) => new SUnionCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sunionstore
   * @see node_modules/@upstash/redis/docs/commands/set/sunionstore.mdx
   */
  sunionstore = (...args) => new SUnionStoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/time
   */
  time = () => new TimeCommand().exec(this.client);
  /**
   * @see https://redis.io/commands/touch
   * @see node_modules/@upstash/redis/docs/commands/generic/touch.mdx
   */
  touch = (...args) => new TouchCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/ttl
   * @see node_modules/@upstash/redis/docs/commands/generic/ttl.mdx
   */
  ttl = (...args) => new TtlCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/type
   * @see node_modules/@upstash/redis/docs/commands/generic/type.mdx
   */
  type = (...args) => new TypeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/unlink
   * @see node_modules/@upstash/redis/docs/commands/generic/unlink.mdx
   */
  unlink = (...args) => new UnlinkCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xadd
   * @see node_modules/@upstash/redis/docs/commands/stream/xadd.mdx
   */
  xadd = (...args) => new XAddCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xack
   * @see node_modules/@upstash/redis/docs/commands/stream/xack.mdx
   */
  xack = (...args) => new XAckCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xackdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xackdel.mdx
   */
  xackdel = (...args) => new XAckDelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xdel.mdx
   */
  xdel = (...args) => new XDelCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xdelex
   * @see node_modules/@upstash/redis/docs/commands/stream/xdelex.mdx
   */
  xdelex = (...args) => new XDelExCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xgroup.mdx
   */
  xgroup = (...args) => new XGroupCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xread
   * @see node_modules/@upstash/redis/docs/commands/stream/xread.mdx
   */
  xread = (...args) => new XReadCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xreadgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xreadgroup.mdx
   */
  xreadgroup = (...args) => new XReadGroupCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xinfo
   * @see node_modules/@upstash/redis/docs/commands/stream/xinfo.mdx
   */
  xinfo = (...args) => new XInfoCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xlen
   * @see node_modules/@upstash/redis/docs/commands/stream/xlen.mdx
   */
  xlen = (...args) => new XLenCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xpending
   * @see node_modules/@upstash/redis/docs/commands/stream/xpending.mdx
   */
  xpending = (...args) => new XPendingCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xclaim.mdx
   */
  xclaim = (...args) => new XClaimCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xautoclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xautoclaim.mdx
   */
  xautoclaim = (...args) => new XAutoClaim(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xtrim
   * @see node_modules/@upstash/redis/docs/commands/stream/xtrim.mdx
   */
  xtrim = (...args) => new XTrimCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, xrange returns [id, [field, value, ...]] entries instead,
   * such as [["1790341484470-0", ["text", "123"]]], and [] for a missing key.
   */
  xrange = (...args) => new XRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/xrevrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrevrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   * With automaticDeserialization: false, xrevrange returns [id, [field, value, ...]] entries instead,
   * such as [["1790341484470-0", ["text", "123"]]], and [] for a missing key.
   */
  xrevrange = (...args) => new XRevRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zadd
   * @see node_modules/@upstash/redis/docs/commands/zset/zadd.mdx
   */
  zadd = (...args) => {
    if ("score" in args[1]) {
      return new ZAddCommand([args[0], args[1], ...args.slice(2)], this.opts).exec(
        this.client
      );
    }
    return new ZAddCommand(
      [args[0], args[1], ...args.slice(2)],
      this.opts
    ).exec(this.client);
  };
  /**
   * @see https://redis.io/commands/zcard
   * @see node_modules/@upstash/redis/docs/commands/zset/zcard.mdx
   */
  zcard = (...args) => new ZCardCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zcount.mdx
   */
  zcount = (...args) => new ZCountCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zdiffstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zdiffstore.mdx
   */
  zdiffstore = (...args) => new ZDiffStoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zincrby
   * @see node_modules/@upstash/redis/docs/commands/zset/zincrby.mdx
   */
  zincrby = (key, increment, member) => new ZIncrByCommand([key, increment, member], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zinterstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zinterstore.mdx
   */
  zinterstore = (...args) => new ZInterStoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zlexcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zlexcount.mdx
   */
  zlexcount = (...args) => new ZLexCountCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zmscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zmscore.mdx
   */
  zmscore = (...args) => new ZMScoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zpopmax
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmax.mdx
   */
  zpopmax = (...args) => new ZPopMaxCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zpopmin
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmin.mdx
   */
  zpopmin = (...args) => new ZPopMinCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zrange
   * @see node_modules/@upstash/redis/docs/commands/zset/zrange.mdx
   * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
   * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
   * to receive raw strings.
   */
  zrange = (...args) => new ZRangeCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrank.mdx
   */
  zrank = (key, member) => new ZRankCommand([key, member], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zrem
   * @see node_modules/@upstash/redis/docs/commands/zset/zrem.mdx
   */
  zrem = (key, ...members) => new ZRemCommand([key, ...members], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zremrangebylex
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebylex.mdx
   */
  zremrangebylex = (...args) => new ZRemRangeByLexCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zremrangebyrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyrank.mdx
   */
  zremrangebyrank = (...args) => new ZRemRangeByRankCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zremrangebyscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyscore.mdx
   */
  zremrangebyscore = (...args) => new ZRemRangeByScoreCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zrevrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrevrank.mdx
   */
  zrevrank = (key, member) => new ZRevRankCommand([key, member], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zscan
   * @see node_modules/@upstash/redis/docs/commands/zset/zscan.mdx
   */
  zscan = (...args) => new ZScanCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zscore.mdx
   */
  zscore = (key, member) => new ZScoreCommand([key, member], this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zunion
   */
  zunion = (...args) => new ZUnionCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/zunionstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zunionstore.mdx
   */
  zunionstore = (...args) => new ZUnionStoreCommand(args, this.opts).exec(this.client);
};
var VERSION = "v1.41.1";

// node_modules/@upstash/redis/nodejs.mjs
var BUILD = /* @__PURE__ */ Symbol("build");
var TextFieldBuilder = class _TextFieldBuilder {
  _noTokenize;
  _noStem;
  _from;
  constructor(noTokenize = { noTokenize: false }, noStem = { noStem: false }, from = { from: null }) {
    this._noTokenize = noTokenize;
    this._noStem = noStem;
    this._from = from;
  }
  noTokenize() {
    return new _TextFieldBuilder({ noTokenize: true }, this._noStem, this._from);
  }
  noStem() {
    return new _TextFieldBuilder(this._noTokenize, { noStem: true }, this._from);
  }
  from(field) {
    return new _TextFieldBuilder(this._noTokenize, this._noStem, { from: field });
  }
  [BUILD]() {
    return {
      type: "TEXT",
      ...this._noTokenize.noTokenize ? { noTokenize: true } : {},
      ...this._noStem.noStem ? { noStem: true } : {},
      ...this._from.from ? { from: this._from.from } : {}
    };
  }
};
var NumericFieldBuilder = class _NumericFieldBuilder {
  type;
  _from;
  constructor(type, from = { from: null }) {
    this.type = type;
    this._from = from;
  }
  from(field) {
    return new _NumericFieldBuilder(this.type, { from: field });
  }
  [BUILD]() {
    return this._from.from ? {
      type: this.type,
      fast: true,
      from: this._from.from
    } : {
      type: this.type,
      fast: true
    };
  }
};
var BoolFieldBuilder = class _BoolFieldBuilder {
  _fast;
  _from;
  constructor(fast = { fast: false }, from = { from: null }) {
    this._fast = fast;
    this._from = from;
  }
  fast() {
    return new _BoolFieldBuilder({ fast: true }, this._from);
  }
  from(field) {
    return new _BoolFieldBuilder(this._fast, { from: field });
  }
  [BUILD]() {
    const hasFast = this._fast.fast;
    const hasFrom = Boolean(this._from.from);
    if (hasFast && hasFrom) {
      return {
        type: "BOOL",
        fast: true,
        from: this._from.from
      };
    }
    if (hasFast) {
      return {
        type: "BOOL",
        fast: true
      };
    }
    if (hasFrom) {
      return {
        type: "BOOL",
        from: this._from.from
      };
    }
    return { type: "BOOL" };
  }
};
var DateFieldBuilder = class _DateFieldBuilder {
  _fast;
  _from;
  constructor(fast = { fast: false }, from = { from: null }) {
    this._fast = fast;
    this._from = from;
  }
  fast() {
    return new _DateFieldBuilder({ fast: true }, this._from);
  }
  from(field) {
    return new _DateFieldBuilder(this._fast, { from: field });
  }
  [BUILD]() {
    const hasFast = this._fast.fast;
    const hasFrom = Boolean(this._from.from);
    if (hasFast && hasFrom) {
      return {
        type: "DATE",
        fast: true,
        from: this._from.from
      };
    }
    if (hasFast) {
      return {
        type: "DATE",
        fast: true
      };
    }
    if (hasFrom) {
      return {
        type: "DATE",
        from: this._from.from
      };
    }
    return { type: "DATE" };
  }
};
var HybridFieldBuilder = class _HybridFieldBuilder {
  _noStem;
  _from;
  constructor(noStem = { noStem: false }, from = { from: null }) {
    this._noStem = noStem;
    this._from = from;
  }
  noStem() {
    return new _HybridFieldBuilder({ noStem: true }, this._from);
  }
  from(field) {
    return new _HybridFieldBuilder(this._noStem, { from: field });
  }
  [BUILD]() {
    return {
      type: "HYBRID",
      ...this._noStem.noStem ? { noStem: true } : {},
      ...this._from.from ? { from: this._from.from } : {}
    };
  }
};
var KeywordFieldBuilder = class {
  [BUILD]() {
    return { type: "KEYWORD" };
  }
};
var FacetFieldBuilder = class {
  [BUILD]() {
    return { type: "FACET" };
  }
};
if (typeof atob === "undefined") {
  global.atob = (b64) => Buffer.from(b64, "base64").toString("utf8");
}
var Redis2 = class _Redis extends Redis {
  /**
   * Create a new redis client by providing a custom `Requester` implementation
   *
   * @example
   * ```ts
   *
   * import { UpstashRequest, Requester, UpstashResponse, Redis } from "@upstash/redis"
   *
   *  const requester: Requester = {
   *    request: <TResult>(req: UpstashRequest): Promise<UpstashResponse<TResult>> => {
   *      // ...
   *    }
   *  }
   *
   * const redis = new Redis(requester)
   * ```
   */
  constructor(configOrRequester) {
    if ("request" in configOrRequester) {
      super(configOrRequester);
      return;
    }
    if (!configOrRequester.url) {
      console.warn(
        `[Upstash Redis] The 'url' property is missing or undefined in your Redis config.`
      );
    } else if (configOrRequester.url.startsWith(" ") || configOrRequester.url.endsWith(" ") || /\r|\n/.test(configOrRequester.url)) {
      console.warn(
        "[Upstash Redis] The redis url contains whitespace or newline, which can cause errors!"
      );
    }
    if (!configOrRequester.token) {
      console.warn(
        `[Upstash Redis] The 'token' property is missing or undefined in your Redis config.`
      );
    } else if (configOrRequester.token.startsWith(" ") || configOrRequester.token.endsWith(" ") || /\r|\n/.test(configOrRequester.token)) {
      console.warn(
        "[Upstash Redis] The redis token contains whitespace or newline, which can cause errors!"
      );
    }
    const client = new HttpClient({
      baseUrl: configOrRequester.url,
      retry: configOrRequester.retry,
      headers: { authorization: `Bearer ${configOrRequester.token}` },
      agent: configOrRequester.agent,
      responseEncoding: configOrRequester.responseEncoding,
      cache: configOrRequester.cache ?? "no-store",
      signal: configOrRequester.signal,
      keepAlive: configOrRequester.keepAlive,
      readYourWrites: configOrRequester.readYourWrites
    });
    const safeEnv = typeof process === "object" && process && typeof process.env === "object" && process.env ? process.env : {};
    super(client, {
      automaticDeserialization: configOrRequester.automaticDeserialization,
      enableTelemetry: configOrRequester.enableTelemetry ?? !safeEnv.UPSTASH_DISABLE_TELEMETRY,
      latencyLogging: configOrRequester.latencyLogging,
      enableAutoPipelining: configOrRequester.enableAutoPipelining
    });
    const nodeVersion = typeof process === "object" && process ? process.version : void 0;
    this.addTelemetry({
      runtime: (
        // @ts-expect-error to silence compiler
        typeof EdgeRuntime === "string" ? "edge-light" : nodeVersion ? `node@${nodeVersion}` : "unknown"
      ),
      platform: safeEnv.UPSTASH_CONSOLE ? "console" : safeEnv.VERCEL ? "vercel" : safeEnv.AWS_REGION ? "aws" : "unknown",
      sdk: `@upstash/redis@${VERSION}`
    });
    if (this.enableAutoPipelining) {
      return this.autoPipeline();
    }
  }
  /**
   * Create a new Upstash Redis instance from environment variables.
   *
   * Use this to automatically load connection secrets from your environment
   * variables. For instance when using the Vercel integration.
   *
   * This tries to load connection details from your environment using `process.env`:
   * - URL: `UPSTASH_REDIS_REST_URL` or fallback to `KV_REST_API_URL`
   * - Token: `UPSTASH_REDIS_REST_TOKEN` or fallback to `KV_REST_API_TOKEN`
   *
   * The fallback variables provide compatibility with Vercel KV and other platforms
   * that may use different naming conventions.
   */
  static fromEnv(config) {
    if (typeof process !== "object" || !process || typeof process.env !== "object" || !process.env) {
      throw new TypeError(
        '[Upstash Redis] Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead'
      );
    }
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    if (!url) {
      console.warn("[Upstash Redis] Unable to find environment variable: `UPSTASH_REDIS_REST_URL`");
    }
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!token) {
      console.warn(
        "[Upstash Redis] Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`"
      );
    }
    return new _Redis({ ...config, url, token });
  }
};

// server/db.ts
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();
var isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
var DATA_DIR = isServerless ? path.resolve("/tmp", "knotsnco_data") : path.resolve(process.cwd(), "server/data");
var ORDERS_FILE = path.join(DATA_DIR, "orders.json");
var WEBHOOKS_FILE = path.join(DATA_DIR, "webhooks.json");
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}
var cachedRedis = null;
function getRedisClient() {
  const hasEnv = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
  if (!hasEnv) {
    cachedRedis = null;
    return null;
  }
  if (!cachedRedis) {
    try {
      cachedRedis = Redis2.fromEnv();
      console.log("\u26A1 [Database] Connected to Upstash Redis via Redis.fromEnv()");
    } catch (err) {
      console.warn("[Database] Redis.fromEnv() initialization failed:", err?.message || err);
      return null;
    }
  }
  return cachedRedis;
}
var Database = class {
  constructor() {
    this.orders = /* @__PURE__ */ new Map();
    this.webhookEvents = /* @__PURE__ */ new Set();
    this.ordersByRazorpayId = /* @__PURE__ */ new Map();
    this.ordersByPaymentLinkId = /* @__PURE__ */ new Map();
    this.ordersByPaymentId = /* @__PURE__ */ new Map();
    this.verificationLocks = /* @__PURE__ */ new Set();
    this.initFileStore();
  }
  initFileStore() {
    if (!ensureDataDir()) return;
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
        const data = JSON.parse(raw);
        if (data.orders) {
          for (const v of Object.values(data.orders)) {
            this.indexInMemory(v);
          }
        }
      }
      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
        const data = JSON.parse(raw);
        if (data.events) {
          for (const k of Object.keys(data.events)) {
            this.webhookEvents.add(k);
          }
        }
      }
    } catch {
    }
  }
  isConfigured() {
    return Boolean(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    );
  }
  /**
   * Health check verifying Redis connectivity via PING command
   */
  async checkHealth() {
    const redis = getRedisClient();
    if (!redis) {
      return { ok: false, error: "unconfigured" };
    }
    const start = Date.now();
    try {
      const ping = await redis.ping();
      const latencyMs = Date.now() - start;
      return { ok: ping === "PONG", latencyMs };
    } catch (err) {
      return { ok: false, error: err?.message || "ping_failed" };
    }
  }
  indexInMemory(order) {
    this.orders.set(order.orderReference, order);
    if (order.razorpay?.orderId) {
      this.ordersByRazorpayId.set(order.razorpay.orderId, order.orderReference);
    }
    if (order.razorpay?.paymentLinkId) {
      this.ordersByPaymentLinkId.set(order.razorpay.paymentLinkId, order.orderReference);
    }
    if (order.razorpay?.paymentId) {
      this.ordersByPaymentId.set(order.razorpay.paymentId, order.orderReference);
    }
  }
  persistOrdersToFile() {
    if (!ensureDataDir()) return;
    try {
      const obj = {};
      for (const [k, v] of this.orders.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: obj }, null, 2), "utf-8");
    } catch {
    }
  }
  persistWebhookEventToFile(record) {
    if (!ensureDataDir()) return;
    try {
      let events = {};
      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
        const data = JSON.parse(raw);
        events = data.events || {};
      }
      events[record.eventId] = record;
      fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify({ events }, null, 2), "utf-8");
    } catch {
    }
  }
  // ─── Orders API (Durable Redis Persistence) ─────────────────────────────────
  async saveOrder(order) {
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.indexInMemory(order);
    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.set(`order:${order.orderReference}`, JSON.stringify(order));
        if (order.razorpay?.orderId) {
          await redis.set(`idx:rzp_order:${order.razorpay.orderId}`, order.orderReference);
        }
        if (order.razorpay?.paymentLinkId) {
          await redis.set(`idx:plink:${order.razorpay.paymentLinkId}`, order.orderReference);
        }
        if (order.razorpay?.paymentId) {
          await redis.set(`idx:pay:${order.razorpay.paymentId}`, order.orderReference);
        }
        await redis.sadd("orders:all", order.orderReference);
      } catch (err) {
        console.error("[Database:Redis] saveOrder error:", err?.message || err);
      }
    }
    this.persistOrdersToFile();
    return order;
  }
  async getOrderByReference(orderReference) {
    if (!orderReference) return void 0;
    const redis = getRedisClient();
    if (redis) {
      try {
        const raw = await redis.get(`order:${orderReference}`);
        if (raw) {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          this.indexInMemory(parsed);
          return parsed;
        }
      } catch (err) {
        console.warn("[Database:Redis] getOrderByReference error:", err?.message || err);
      }
    }
    return this.orders.get(orderReference);
  }
  async getOrderByRazorpayOrderId(razorpayOrderId) {
    if (!razorpayOrderId) return void 0;
    const redis = getRedisClient();
    if (redis) {
      try {
        const ref2 = await redis.get(`idx:rzp_order:${razorpayOrderId}`);
        if (ref2) {
          return this.getOrderByReference(ref2);
        }
      } catch (err) {
        console.warn("[Database:Redis] getOrderByRazorpayOrderId error:", err?.message || err);
      }
    }
    const ref = this.ordersByRazorpayId.get(razorpayOrderId);
    if (ref) return this.orders.get(ref);
    for (const order of this.orders.values()) {
      if (order.razorpay?.orderId === razorpayOrderId) return order;
    }
    return void 0;
  }
  async getOrderByPaymentLinkId(paymentLinkId) {
    if (!paymentLinkId) return void 0;
    const redis = getRedisClient();
    if (redis) {
      try {
        const ref2 = await redis.get(`idx:plink:${paymentLinkId}`);
        if (ref2) {
          return this.getOrderByReference(ref2);
        }
      } catch (err) {
        console.warn("[Database:Redis] getOrderByPaymentLinkId error:", err?.message || err);
      }
    }
    const ref = this.ordersByPaymentLinkId.get(paymentLinkId);
    if (ref) return this.orders.get(ref);
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentLinkId === paymentLinkId) return order;
    }
    return void 0;
  }
  async getOrderByPaymentId(paymentId) {
    if (!paymentId) return void 0;
    const redis = getRedisClient();
    if (redis) {
      try {
        const ref2 = await redis.get(`idx:pay:${paymentId}`);
        if (ref2) {
          return this.getOrderByReference(ref2);
        }
      } catch (err) {
        console.warn("[Database:Redis] getOrderByPaymentId error:", err?.message || err);
      }
    }
    const ref = this.ordersByPaymentId.get(paymentId);
    if (ref) return this.orders.get(ref);
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentId === paymentId) return order;
    }
    return void 0;
  }
  async getAllOrders() {
    const redis = getRedisClient();
    if (redis) {
      try {
        const refs = await redis.smembers("orders:all");
        if (refs && refs.length > 0) {
          const orders = [];
          for (const ref of refs) {
            const ord = await this.getOrderByReference(String(ref));
            if (ord) orders.push(ord);
          }
          return orders;
        }
      } catch (err) {
        console.warn("[Database:Redis] getAllOrders error:", err?.message || err);
      }
    }
    return Array.from(this.orders.values());
  }
  // ─── Webhook Deduplication API (Atomic SETNX) ───────────────────────────────
  async hasWebhookEvent(eventId) {
    if (!eventId) return false;
    const redis = getRedisClient();
    if (redis) {
      try {
        const exists = await redis.exists(`webhook:event:${eventId}`);
        if (exists === 1) return true;
      } catch (err) {
        console.warn("[Database:Redis] hasWebhookEvent error:", err?.message || err);
      }
    }
    return this.webhookEvents.has(eventId);
  }
  /**
   * Atomically records a webhook event. Returns true if this is a NEW event,
   * or false if it was already recorded by another concurrent request.
   */
  async recordWebhookEvent(record) {
    if (!record?.eventId) return false;
    const redis = getRedisClient();
    if (redis) {
      try {
        const setResult = await redis.set(
          `webhook:event:${record.eventId}`,
          JSON.stringify(record),
          { nx: true, ex: 2592e3 }
        );
        const isNew = setResult !== null;
        if (isNew) {
          this.webhookEvents.add(record.eventId);
          this.persistWebhookEventToFile(record);
        }
        return isNew;
      } catch (err) {
        console.warn("[Database:Redis] recordWebhookEvent error:", err?.message || err);
      }
    }
    if (this.webhookEvents.has(record.eventId)) {
      return false;
    }
    this.webhookEvents.add(record.eventId);
    this.persistWebhookEventToFile(record);
    return true;
  }
  // ─── Distributed Lock for Concurrency Safety & Idempotency ───────────────────
  /**
   * Acquires a distributed lock on order verification to prevent concurrent
   * executions between customer browser redirects and webhook events.
   */
  async acquireVerificationLock(orderReference, ttlSeconds = 30) {
    if (!orderReference) return false;
    const redis = getRedisClient();
    if (redis) {
      try {
        const lock = await redis.set(
          `lock:verify:${orderReference}`,
          Date.now().toString(),
          { nx: true, ex: ttlSeconds }
        );
        return lock !== null;
      } catch (err) {
        console.warn("[Database:Redis] acquireVerificationLock error:", err?.message || err);
      }
    }
    if (this.verificationLocks.has(orderReference)) {
      return false;
    }
    this.verificationLocks.add(orderReference);
    return true;
  }
  async releaseVerificationLock(orderReference) {
    if (!orderReference) return;
    this.verificationLocks.delete(orderReference);
    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.del(`lock:verify:${orderReference}`);
      } catch (err) {
        console.warn("[Database:Redis] releaseVerificationLock error:", err?.message || err);
      }
    }
  }
};
var db = new Database();

// server/services/razorpay.ts
import crypto from "crypto";
function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  return { keyId, keySecret, webhookSecret };
}
function getBasicAuthHeader(keyId, keySecret) {
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${credentials}`;
}
async function createRazorpayOrder(params) {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    console.warn("\u26A0\uFE0F Razorpay credentials missing in environment (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET). Using mock test order.");
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: params.amountInPaise,
      currency: "INR",
      receipt: params.orderReference,
      status: "created"
    };
  }
  const payload = {
    amount: params.amountInPaise,
    currency: "INR",
    receipt: params.orderReference,
    notes: {
      orderReference: params.orderReference,
      customerName: params.customer?.name || "",
      customerEmail: params.customer?.email || "",
      customerPhone: params.customer?.phone || "",
      ...params.notes || {}
    }
  };
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBasicAuthHeader(keyId, keySecret)
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay Orders API Error (${response.status}): ${errorText}`);
  }
  return await response.json();
}
async function createRazorpayPaymentLink(params) {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    console.warn("\u26A0\uFE0F Razorpay credentials missing. Using mock test payment link.");
    return {
      id: `plink_mock_${Date.now()}`,
      short_url: `http://localhost:3000/#order-confirmation?orderRef=${params.orderReference}`,
      status: "created",
      reference_id: params.orderReference
    };
  }
  const payload = {
    amount: params.amountInPaise,
    currency: "INR",
    accept_partial: false,
    reference_id: params.orderReference,
    description: params.description || `Knotsnco Handmade Order #${params.orderReference}`,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      contact: params.customer.phone
    },
    notify: {
      sms: true,
      email: true
    },
    reminder_enable: false,
    callback_url: params.callbackUrl,
    callback_method: "get",
    notes: {
      orderReference: params.orderReference
    }
  };
  const response = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBasicAuthHeader(keyId, keySecret)
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay Payment Link API Error (${response.status}): ${errorText}`);
  }
  return await response.json();
}
async function fetchRazorpayPayment(paymentId) {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    if (paymentId.startsWith("pay_mock_") || paymentId.startsWith("pay_test_")) {
      return {
        id: paymentId,
        status: "captured",
        currency: "INR",
        method: "upi"
      };
    }
    throw new Error("Razorpay keys not configured on server");
  }
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: getBasicAuthHeader(keyId, keySecret)
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Razorpay payment (${response.status}): ${errorText}`);
  }
  return await response.json();
}
function safeTimingEqual(expected, actual) {
  if (!expected || !actual) return false;
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(actual, "hex");
  if (expectedBuf.length === 0 || actualBuf.length === 0 || expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
function verifyStandardCheckoutSignature(params) {
  const { keySecret } = getRazorpayConfig();
  if ((!keySecret || keySecret === "test_secret") && params.signature === "test_signature_valid") {
    return true;
  }
  if (!keySecret) {
    console.error("Cannot verify signature: RAZORPAY_KEY_SECRET is not set.");
    return false;
  }
  const payload = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
  return safeTimingEqual(expectedSignature, params.signature);
}
function verifyPaymentLinkSignature(params) {
  const { keySecret } = getRazorpayConfig();
  if ((!keySecret || keySecret === "test_secret") && params.signature === "test_signature_valid") {
    return true;
  }
  if (!keySecret) {
    console.error("Cannot verify signature: RAZORPAY_KEY_SECRET is not set.");
    return false;
  }
  const payload = `${params.paymentLinkId}|${params.paymentLinkReferenceId}|${params.paymentLinkStatus}|${params.paymentId}`;
  const expectedSignature = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
  return safeTimingEqual(expectedSignature, params.signature);
}
function verifyWebhookSignature(rawBody, signature) {
  const { webhookSecret } = getRazorpayConfig();
  if (!webhookSecret) {
    console.error("Cannot verify webhook signature: RAZORPAY_WEBHOOK_SECRET is not set.");
    return false;
  }
  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return safeTimingEqual(expectedSignature, signature);
}

// server/services/shopifyAdmin.ts
var cachedAdminToken = null;
var inFlightTokenPromise = null;
async function fetchNewAccessToken() {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || "04wv6h-ut.myshopify.com";
  if (process.env.MOCK_SHOPIFY === "true") {
    return "mock_admin_token";
  }
  if (!clientId || !clientSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[ShopifyAdmin] Missing credentials: SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are required in production."
      );
    }
    return "mock_admin_token";
  }
  const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret
  });
  let response;
  try {
    response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: params.toString()
    });
  } catch (netErr) {
    throw new Error(`[ShopifyAdmin] Network error connecting to Shopify OAuth: ${netErr?.message || netErr}`);
  }
  if (!response.ok) {
    const rawBody = await response.text();
    let sanitizedError = "";
    try {
      const parsedJson = JSON.parse(rawBody);
      sanitizedError = parsedJson.error_description || parsedJson.error || parsedJson.errors || "";
    } catch {
      const match = rawBody.match(/Oauth error ([^<:\n]+)(?::\s*([^<\n]+))?/i) || rawBody.match(/<title>([^<]+)<\/title>/i);
      if (match) {
        sanitizedError = (match[2] ? `${match[1]}: ${match[2]}` : match[1]).trim();
      } else {
        sanitizedError = `HTTP ${response.status} ${response.statusText}`;
      }
    }
    if (sanitizedError.includes("shop_not_permitted") || rawBody.includes("shop_not_permitted")) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: shop_not_permitted. Ensure the app "Knotsnco Backend Integration" is installed and approved on store "${storeDomain}".`
      );
    }
    if (sanitizedError.includes("application_cannot_be_found") || rawBody.includes("application_cannot_be_found")) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: application_cannot_be_found. The SHOPIFY_CLIENT_ID does not match an app registered for store "${storeDomain}".`
      );
    }
    if (sanitizedError.includes("invalid_client") || sanitizedError.includes("invalid_request")) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: invalid_client/invalid_request. Verify SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.`
      );
    }
    throw new Error(
      `[ShopifyAdmin] Failed to obtain Shopify Admin access token (HTTP ${response.status}): ${sanitizedError}`
    );
  }
  const data = await response.json();
  if (!data.access_token) {
    throw new Error("[ShopifyAdmin] Shopify OAuth response did not contain an access_token.");
  }
  const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 86400;
  const now = Date.now();
  cachedAdminToken = {
    token: data.access_token,
    expiresAt: now + expiresInSec * 1e3,
    scope: data.scope
  };
  return data.access_token;
}
async function getShopifyAdminAccessToken() {
  const now = Date.now();
  if (cachedAdminToken && cachedAdminToken.expiresAt - 3e5 > now) {
    return cachedAdminToken.token;
  }
  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }
  inFlightTokenPromise = fetchNewAccessToken().finally(() => {
    inFlightTokenPromise = null;
  });
  return inFlightTokenPromise;
}
function getShopifyAdminConfig() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || "04wv6h-ut.myshopify.com";
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-10";
  return { storeDomain, apiVersion };
}
var ORDER_CREATE_MUTATION = `
  mutation OrderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
    orderCreate(order: $order, options: $options) {
      order {
        id
        name
        displayFinancialStatus
        createdAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
function buildShopifyOrderCreatePayload(order, razorpayPaymentId) {
  const nameParts = (order.customer.name || "").trim().split(" ");
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.slice(1).join(" ") || "";
  const lineItems = order.items.map((item) => ({
    variantId: item.variantId.startsWith("gid://") ? item.variantId : `gid://shopify/ProductVariant/${item.variantId}`,
    quantity: item.quantity,
    priceSet: {
      shopMoney: {
        amount: Number(item.unitPrice).toFixed(2),
        currencyCode: "INR"
      }
    }
  }));
  const finalAmountStr = Number(order.pricing.finalAmount).toFixed(2);
  const orderInput = {
    lineItems,
    financialStatus: "PAID",
    transactions: [
      {
        kind: "SALE",
        status: "SUCCESS",
        gateway: "Razorpay",
        amountSet: {
          shopMoney: {
            amount: finalAmountStr,
            currencyCode: "INR"
          }
        },
        authorizationCode: razorpayPaymentId
      }
    ],
    email: order.customer.email,
    phone: order.customer.phone || void 0,
    shippingAddress: {
      address1: order.shippingAddress.address1,
      address2: order.shippingAddress.address2 || "",
      city: order.shippingAddress.city,
      province: order.shippingAddress.province || order.shippingAddress.state || "",
      zip: order.shippingAddress.zip,
      country: "India",
      countryCode: "IN",
      firstName,
      lastName,
      phone: order.customer.phone || void 0
    },
    billingAddress: {
      address1: order.billingAddress.address1 || order.shippingAddress.address1,
      address2: order.billingAddress.address2 || order.shippingAddress.address2 || "",
      city: order.billingAddress.city || order.shippingAddress.city,
      province: order.billingAddress.province || order.billingAddress.state || order.shippingAddress.province || "",
      zip: order.billingAddress.zip || order.shippingAddress.zip,
      country: "India",
      countryCode: "IN",
      firstName,
      lastName,
      phone: order.customer.phone || void 0
    },
    shippingLines: [
      {
        title: order.pricing.shippingCharge === 0 ? "Free Standard Delivery" : "Standard Delivery",
        priceSet: {
          shopMoney: {
            amount: Number(order.pricing.shippingCharge || 0).toFixed(2),
            currencyCode: "INR"
          }
        }
      }
    ],
    note: `Order placed via Knotsnco Headless Storefront. Internal Ref: ${order.orderReference}. Razorpay Payment ID: ${razorpayPaymentId}`,
    tags: ["Knotsnco Headless", "Razorpay Paid", `Ref:${order.orderReference}`],
    customAttributes: [
      { key: "knotsnco_order_ref", value: order.orderReference },
      { key: "razorpay_payment_id", value: razorpayPaymentId }
    ]
  };
  const optionsInput = {
    inventoryBehaviour: "DECREMENT_OBEYING_POLICY",
    sendReceipt: true
    // Triggers Shopify's automated order confirmation email to the customer
  };
  return {
    order: orderInput,
    options: optionsInput
  };
}
async function createShopifyAdminOrder(order, razorpayPaymentId) {
  const { storeDomain, apiVersion } = getShopifyAdminConfig();
  const adminAccessToken = await getShopifyAdminAccessToken();
  if (order.shopify?.orderId && order.shopify?.orderNumber) {
    console.log(`[ShopifyAdmin] Order ${order.orderReference} already has Shopify order ${order.shopify.orderNumber}. Skipping creation.`);
    return {
      orderId: order.shopify.orderId,
      orderNumber: order.shopify.orderNumber,
      financialStatus: "PAID",
      createdAt: order.shopify.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (adminAccessToken === "mock_admin_token") {
    console.warn(
      `[ShopifyAdmin] \u26A0\uFE0F Running in mock mode. Simulating verified order creation for ${order.orderReference}.`
    );
    const mockOrderNumber = `#KNOTS-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const mockOrderId = `gid://shopify/Order/mock_${Date.now()}`;
    return {
      orderId: mockOrderId,
      orderNumber: mockOrderNumber,
      financialStatus: "PAID",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const endpoint = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;
  const { order: orderInput, options: optionsInput } = buildShopifyOrderCreatePayload(order, razorpayPaymentId);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminAccessToken
    },
    body: JSON.stringify({
      query: ORDER_CREATE_MUTATION,
      variables: {
        order: orderInput,
        options: optionsInput
      }
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Admin API HTTP ${response.status}: ${errorText}`);
  }
  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    const msg = result.errors.map((e) => e.message).join(", ");
    throw new Error(`Shopify Admin GraphQL Error: ${msg}`);
  }
  const orderData = result.data?.orderCreate?.order;
  const userErrors = result.data?.orderCreate?.userErrors;
  if (userErrors && userErrors.length > 0) {
    const msg = userErrors.map((e) => `${e.field?.join(".")}: ${e.message}`).join(", ");
    throw new Error(`Shopify Order Creation Rejected: ${msg}`);
  }
  if (!orderData || !orderData.id) {
    throw new Error("Shopify Admin API did not return a valid order object.");
  }
  console.log(`[ShopifyAdmin] Successfully created Shopify order ${orderData.name} (${orderData.id}) for Ref ${order.orderReference}`);
  return {
    orderId: orderData.id,
    orderNumber: orderData.name,
    financialStatus: orderData.displayFinancialStatus || "PAID",
    createdAt: orderData.createdAt
  };
}

// server/app.ts
var app = express();
var apiRouter = express.Router();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Razorpay-Signature, x-razorpay-event-id"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));
apiRouter.get("/health", async (_req, res) => {
  const redisHealth = await db.checkHealth();
  const redisConfigured = db.isConfigured();
  res.json({
    status: "ok",
    store: "Knotsnco Headless Storefront",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    runtime: process.env.VERCEL ? "vercel-serverless" : "node-server",
    redis: {
      status: redisHealth.ok ? "connected" : redisConfigured ? "error" : "unconfigured",
      provider: "Upstash Redis",
      region: "ap-south-1 (Mumbai)",
      latencyMs: redisHealth.latencyMs,
      error: redisHealth.error
    }
  });
});
apiRouter.post("/checkout/create-order", async (req, res) => {
  try {
    const { items, customer, shippingAddress, billingAddress, mode = "standard" } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Order must contain at least one item." });
      return;
    }
    if (!customer || !customer.email || !customer.name || !customer.phone) {
      res.status(400).json({ error: "Customer name, email, and phone are required." });
      return;
    }
    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.zip) {
      res.status(400).json({ error: "Complete shipping address (address1, city, zip) is required." });
      return;
    }
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderReference = `KNOTS-${Date.now()}-${randomSuffix}`;
    let subtotal = 0;
    const sanitizedItems = items.map((it) => {
      const unitPrice = Math.max(0, Number(it.unitPrice || it.price || 0));
      const quantity = Math.max(1, Math.floor(Number(it.quantity || 1)));
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;
      return {
        productId: String(it.productId || ""),
        variantId: String(it.variantId || ""),
        title: String(it.title || "Handcrafted Crochet Item"),
        subtitle: it.subtitle ? String(it.subtitle) : void 0,
        image: String(it.image || ""),
        unitPrice,
        quantity,
        lineTotal
      };
    });
    const shippingCharge = subtotal >= 1999 ? 0 : 0;
    const discount = 0;
    const taxes = 0;
    const finalAmount = Math.max(1, subtotal + shippingCharge - discount);
    const amountInPaise = Math.round(finalAmount * 100);
    const fullShippingAddress = {
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || "",
      city: shippingAddress.city,
      province: shippingAddress.province || shippingAddress.state || "",
      state: shippingAddress.state || shippingAddress.province || "",
      zip: shippingAddress.zip,
      country: shippingAddress.country || "India",
      countryCode: shippingAddress.countryCode || "IN",
      firstName: shippingAddress.firstName || customer.name.split(" ")[0] || "Customer",
      lastName: shippingAddress.lastName || customer.name.split(" ").slice(1).join(" ") || "",
      phone: customer.phone
    };
    const fullBillingAddress = billingAddress ? {
      address1: billingAddress.address1 || fullShippingAddress.address1,
      address2: billingAddress.address2 || fullShippingAddress.address2,
      city: billingAddress.city || fullShippingAddress.city,
      province: billingAddress.province || fullShippingAddress.province,
      state: billingAddress.state || fullShippingAddress.state,
      zip: billingAddress.zip || fullShippingAddress.zip,
      country: billingAddress.country || "India",
      countryCode: billingAddress.countryCode || "IN",
      firstName: billingAddress.firstName || fullShippingAddress.firstName,
      lastName: billingAddress.lastName || fullShippingAddress.lastName,
      phone: billingAddress.phone || fullShippingAddress.phone
    } : { ...fullShippingAddress };
    const pendingOrder = {
      orderReference,
      status: "PENDING_PAYMENT",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      items: sanitizedItems,
      pricing: {
        subtotal,
        discount,
        shippingCharge,
        taxes,
        finalAmount,
        amountInPaise,
        currency: "INR"
      },
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim()
      },
      shippingAddress: fullShippingAddress,
      billingAddress: fullBillingAddress,
      razorpay: {}
    };
    const rzpOrder = await createRazorpayOrder({
      orderReference,
      amountInPaise,
      customer: pendingOrder.customer,
      notes: {
        orderReference,
        customerName: pendingOrder.customer.name
      }
    });
    pendingOrder.razorpay = {
      orderId: rzpOrder.id
    };
    if (mode === "payment_link") {
      const frontendBaseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || `${req.protocol}://${req.get("host")}`;
      const callbackUrl = `${frontendBaseUrl}/api/checkout/callback`;
      const pLink = await createRazorpayPaymentLink({
        orderReference,
        amountInPaise,
        callbackUrl,
        customer: pendingOrder.customer,
        description: `Knotsnco Handmade Order ${orderReference}`
      });
      pendingOrder.razorpay.paymentLinkId = pLink.id;
      pendingOrder.razorpay.paymentLinkUrl = pLink.short_url;
    }
    await db.saveOrder(pendingOrder);
    const { keyId } = getRazorpayConfig();
    res.json({
      success: true,
      orderReference: pendingOrder.orderReference,
      razorpayOrderId: pendingOrder.razorpay.orderId,
      paymentLinkId: pendingOrder.razorpay.paymentLinkId,
      paymentLinkUrl: pendingOrder.razorpay.paymentLinkUrl,
      amount: pendingOrder.pricing.finalAmount,
      amountInPaise: pendingOrder.pricing.amountInPaise,
      currency: "INR",
      keyId,
      customer: pendingOrder.customer
    });
  } catch (error) {
    console.error("[CreateOrder] Error creating pending order:", error);
    res.status(500).json({
      error: "Failed to initialize order checkout session",
      details: error.message
    });
  }
});
apiRouter.post("/checkout/verify-payment", async (req, res) => {
  try {
    const { orderReference, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!orderReference || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: "Missing required Razorpay payment verification parameters." });
      return;
    }
    const order = await db.getOrderByReference(orderReference);
    if (!order) {
      res.status(404).json({ error: `Order with reference ${orderReference} not found.` });
      return;
    }
    if (order.status === "PAID" && order.shopify?.orderNumber) {
      res.json({
        success: true,
        orderReference: order.orderReference,
        shopifyOrderNumber: order.shopify.orderNumber,
        shopifyOrderId: order.shopify.orderId,
        message: "Order is already paid and confirmed in Shopify."
      });
      return;
    }
    const lockAcquired = await db.acquireVerificationLock(orderReference);
    if (!lockAcquired) {
      await new Promise((r) => setTimeout(r, 1500));
      const refreshedOrder = await db.getOrderByReference(orderReference);
      if (refreshedOrder?.status === "PAID" && refreshedOrder.shopify?.orderNumber) {
        res.json({
          success: true,
          orderReference: refreshedOrder.orderReference,
          shopifyOrderNumber: refreshedOrder.shopify.orderNumber,
          shopifyOrderId: refreshedOrder.shopify.orderId,
          message: "Order was verified concurrently and confirmed in Shopify."
        });
        return;
      }
    }
    try {
      const isSignatureValid = verifyStandardCheckoutSignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      });
      if (!isSignatureValid) {
        console.error(`[VerifyPayment] Invalid signature for order ${orderReference}.`);
        res.status(400).json({ error: "Payment verification failed: Invalid cryptographic signature." });
        return;
      }
      const payment = await fetchRazorpayPayment(razorpay_payment_id);
      if (payment.status !== "captured" && payment.status !== "authorized") {
        console.warn(`[VerifyPayment] Payment ${razorpay_payment_id} status is ${payment.status}, expected captured.`);
        res.status(400).json({ error: `Payment is not captured. Current status: ${payment.status}` });
        return;
      }
      order.status = "PAYMENT_CAPTURED_SHOPIFY_PENDING";
      order.razorpay = {
        ...order.razorpay || {},
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        method: payment.method || "online",
        paidAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await db.saveOrder(order);
      try {
        const shopifyOrder = await createShopifyAdminOrder(order, razorpay_payment_id);
        order.status = "PAID";
        order.shopify = {
          orderId: shopifyOrder.orderId,
          orderNumber: shopifyOrder.orderNumber,
          createdAt: shopifyOrder.createdAt
        };
        await db.saveOrder(order);
        res.json({
          success: true,
          orderReference: order.orderReference,
          shopifyOrderNumber: shopifyOrder.orderNumber,
          shopifyOrderId: shopifyOrder.orderId
        });
      } catch (shopifyError) {
        console.error(`[VerifyPayment] Payment verified, but Shopify order creation failed for ${orderReference}:`, shopifyError);
        order.shopify = {
          error: shopifyError.message
        };
        await db.saveOrder(order);
        res.json({
          success: true,
          orderReference: order.orderReference,
          pendingSync: true,
          message: "Payment received. Your order is finalizing in Shopify."
        });
      }
    } finally {
      await db.releaseVerificationLock(orderReference);
    }
  } catch (error) {
    console.error("[VerifyPayment] Error during payment verification:", error);
    res.status(500).json({ error: "Internal error verifying payment", details: error.message });
  }
});
apiRouter.get("/checkout/callback", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature
    } = req.query;
    const paymentId = String(razorpay_payment_id || "");
    const linkId = String(razorpay_payment_link_id || "");
    const referenceId = String(razorpay_payment_link_reference_id || "");
    const status = String(razorpay_payment_link_status || "");
    const signature = String(razorpay_signature || "");
    const order = referenceId ? await db.getOrderByReference(referenceId) : linkId ? await db.getOrderByPaymentLinkId(linkId) : void 0;
    const frontendBaseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || `${req.protocol}://${req.get("host")}`;
    if (!order) {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?error=order_not_found`);
      return;
    }
    if (status !== "paid") {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&status=${status}`);
      return;
    }
    const isSignatureValid = verifyPaymentLinkSignature({
      paymentLinkId: linkId,
      paymentLinkReferenceId: referenceId,
      paymentLinkStatus: status,
      paymentId,
      signature
    });
    if (!isSignatureValid) {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&error=invalid_signature`);
      return;
    }
    if (order.status !== "PAID" || !order.shopify?.orderNumber) {
      order.status = "PAYMENT_CAPTURED_SHOPIFY_PENDING";
      order.razorpay = {
        ...order.razorpay || {},
        paymentLinkId: linkId,
        paymentId,
        signature,
        paidAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await db.saveOrder(order);
      try {
        const shopifyOrder = await createShopifyAdminOrder(order, paymentId);
        order.status = "PAID";
        order.shopify = {
          orderId: shopifyOrder.orderId,
          orderNumber: shopifyOrder.orderNumber,
          createdAt: shopifyOrder.createdAt
        };
        await db.saveOrder(order);
      } catch (err) {
        console.error(`[Callback] Shopify order creation error: ${err.message}`);
        order.shopify = { error: err.message };
        await db.saveOrder(order);
      }
    }
    res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&status=success`);
  } catch (error) {
    console.error("[Callback] Error handling Razorpay callback:", error);
    res.redirect(`/#order-confirmation?error=internal_error`);
  }
});
apiRouter.post("/webhooks/razorpay", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];
    if (!signature) {
      console.warn("[Webhook] Missing X-Razorpay-Signature header.");
      res.status(400).json({ error: "Missing X-Razorpay-Signature header." });
      return;
    }
    const rawBody = req.rawBody || (Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body)));
    if (!rawBody || rawBody.length === 0) {
      console.error("[Webhook] Raw request body not available for signature verification.");
      res.status(500).json({ error: "Server misconfiguration: Raw body required." });
      return;
    }
    const isWebhookValid = verifyWebhookSignature(rawBody, signature);
    if (!isWebhookValid) {
      console.error("[Webhook] Invalid X-Razorpay-Signature.");
      res.status(400).json({ error: "Invalid webhook signature." });
      return;
    }
    if (eventId) {
      const isNew = await db.recordWebhookEvent({
        eventId,
        eventType: typeof req.body?.event === "string" ? req.body.event : "unknown",
        processedAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "PROCESSING"
      });
      if (!isNew) {
        console.log(`[Webhook] Duplicate event ${eventId} received. Skipping.`);
        res.status(200).json({ status: "duplicate_ignored", eventId });
        return;
      }
    }
    const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const eventType = event.event;
    console.log(`[Webhook] Processing Razorpay event: ${eventType} (ID: ${eventId || "unknown"})`);
    let orderReference;
    let paymentId;
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const order = event.payload?.order?.entity;
      paymentId = payment?.id;
      orderReference = payment?.notes?.orderReference || order?.notes?.orderReference || payment?.description?.match(/KNOTS-\d+-[A-Z0-9]+/)?.[0];
      let targetOrder;
      if (orderReference) {
        targetOrder = await db.getOrderByReference(orderReference);
      } else if (order?.id) {
        targetOrder = await db.getOrderByRazorpayOrderId(order.id);
      } else if (paymentId) {
        targetOrder = await db.getOrderByPaymentId(paymentId);
      }
      if (targetOrder) {
        orderReference = targetOrder.orderReference;
        if (targetOrder.status !== "PAID" || !targetOrder.shopify?.orderNumber) {
          targetOrder.status = "PAYMENT_CAPTURED_SHOPIFY_PENDING";
          targetOrder.razorpay = {
            ...targetOrder.razorpay || {},
            orderId: order?.id || targetOrder.razorpay?.orderId,
            paymentId: paymentId || targetOrder.razorpay?.paymentId,
            method: payment?.method || targetOrder.razorpay?.method,
            paidAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          await db.saveOrder(targetOrder);
          try {
            const shopifyOrder = await createShopifyAdminOrder(targetOrder, paymentId || "webhook_captured");
            targetOrder.status = "PAID";
            targetOrder.shopify = {
              orderId: shopifyOrder.orderId,
              orderNumber: shopifyOrder.orderNumber,
              createdAt: shopifyOrder.createdAt
            };
            await db.saveOrder(targetOrder);
            console.log(`[Webhook] Created Shopify order ${shopifyOrder.orderNumber} for ${targetOrder.orderReference}`);
          } catch (shopErr) {
            console.error(`[Webhook] Error creating Shopify order: ${shopErr.message}`);
            targetOrder.shopify = { error: shopErr.message };
            await db.saveOrder(targetOrder);
          }
        }
      }
    } else if (eventType === "payment_link.paid") {
      const pLink = event.payload?.payment_link?.entity;
      const payment = event.payload?.payment?.entity;
      paymentId = payment?.id;
      orderReference = pLink?.reference_id || pLink?.notes?.orderReference;
      const targetOrder = orderReference ? await db.getOrderByReference(orderReference) : await db.getOrderByPaymentLinkId(pLink?.id);
      if (targetOrder) {
        if (targetOrder.status !== "PAID" || !targetOrder.shopify?.orderNumber) {
          targetOrder.status = "PAID";
          targetOrder.razorpay = {
            ...targetOrder.razorpay || {},
            paymentLinkId: pLink?.id,
            paymentId,
            paidAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          await db.saveOrder(targetOrder);
          try {
            const shopifyOrder = await createShopifyAdminOrder(targetOrder, paymentId || "plink_captured");
            targetOrder.shopify = {
              orderId: shopifyOrder.orderId,
              orderNumber: shopifyOrder.orderNumber,
              createdAt: shopifyOrder.createdAt
            };
            await db.saveOrder(targetOrder);
          } catch (err) {
            console.error(`[Webhook] Payment link Shopify creation error: ${err.message}`);
          }
        }
      }
    }
    if (eventId) {
      await db.recordWebhookEvent({
        eventId,
        eventType,
        orderReference,
        razorpayPaymentId: paymentId,
        processedAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "SUCCESS"
      });
    }
    res.status(200).json({ status: "ok", event: eventType });
  } catch (error) {
    console.error("[Webhook] Unhandled error in webhook handler:", error);
    res.status(500).json({ error: "Webhook processing error", details: error.message });
  }
});
apiRouter.get("/orders/:orderReference", async (req, res) => {
  const { orderReference } = req.params;
  const order = await db.getOrderByReference(orderReference);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({
    orderReference: order.orderReference,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items,
    pricing: order.pricing,
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone
    },
    shippingAddress: order.shippingAddress,
    razorpay: {
      orderId: order.razorpay?.orderId,
      paymentId: order.razorpay?.paymentId,
      paidAt: order.razorpay?.paidAt
    },
    shopify: {
      orderNumber: order.shopify?.orderNumber,
      createdAt: order.shopify?.createdAt,
      isCreated: Boolean(order.shopify?.orderNumber),
      error: order.shopify?.error
    }
  });
});
app.use("/api", apiRouter);
app.use("/", apiRouter);
var app_default = app;
export {
  apiRouter,
  app,
  app_default as default
};
