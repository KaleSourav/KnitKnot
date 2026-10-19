import React, { useState } from 'react';
import { Modal } from './Modal';
import { CheckCircle2, Play, Sparkles, Database, Workflow, Send, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface DialogsProps {
  activeModal: string | null;
  onClose: () => void;
  onOpenGetStarted: () => void;
  onOpenContact: () => void;
}

export const InteractiveDialogs: React.FC<DialogsProps> = ({
  activeModal,
  onClose,
  onOpenGetStarted,
  onOpenContact,
}) => {
  // Demo State
  const [demoTab, setDemoTab] = useState<'workflow' | 'connectors' | 'ai'>('workflow');
  const [isPlaying, setIsPlaying] = useState(false);

  // Get Started State
  const [email, setEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Contact State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleGetStartedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (step === 1) {
      setStep(2);
    } else {
      setSubmitted(true);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactName) return;
    setContactSent(true);
  };

  const resetAll = () => {
    setSubmitted(false);
    setStep(1);
    setEmail('');
    setWorkspaceName('');
    setContactSent(false);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setIsPlaying(false);
    onClose();
  };

  return (
    <>
      {/* 1. Watch a Demo Modal */}
      <Modal
        isOpen={activeModal === 'demo'}
        onClose={resetAll}
        title="Interactive Platform Demo"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Experience how Zioza unifies real-time intelligence, automated pipelines, and enterprise workflows in one intuitive environment.
          </p>

          {/* Interactive tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-3">
            {[
              { id: 'workflow', label: 'Workflow Engine', icon: Workflow },
              { id: 'connectors', label: 'Data Connectors', icon: Database },
              { id: 'ai', label: 'AI Synthesis', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDemoTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    demoTab === tab.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Simulation */}
          <div className="relative rounded-2xl border border-white/15 bg-black/60 p-5 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-white/80">zioza.app/demo-workspace</span>
              </div>
              <span className="font-mono text-white/50">v2.4 Active</span>
            </div>

            {demoTab === 'workflow' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-sm sm:text-base">Autonomous Pipeline Orchestration</h4>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">99.98% Latency Target</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Trigger Source</div>
                    <div className="text-sm font-semibold text-white">HubSpot & Jira Webhook</div>
                    <div className="text-xs text-white/40 mt-2">Instant payload capture</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">AI Transformer</div>
                    <div className="text-sm font-semibold text-white">Semantic Categorization</div>
                    <div className="text-xs text-white/40 mt-2">Classify & extract intents</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Target Action</div>
                    <div className="text-sm font-semibold text-white">Enterprise Dispatch</div>
                    <div className="text-xs text-white/40 mt-2">Instant sync to cloud & DB</div>
                  </div>
                </div>
              </div>
            )}

            {demoTab === 'connectors' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm sm:text-base">Instant Native Integrations</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {['HubSpot', 'Jira Software', 'Dropbox', 'Zendesk', 'Hotjar', 'DeepL', 'Dorik', 'Dokey'].map((brand) => (
                    <div key={brand} className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mb-2" />
                      <span className="text-xs font-medium text-white">{brand}</span>
                      <span className="text-[10px] text-white/50 mt-1">Connected</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demoTab === 'ai' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white text-sm sm:text-base">Context-Aware AI Synthesis</h4>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white/90 space-y-2">
                  <div className="text-white/50">// Query: Synthesize quarterly customer sentiment & operational bottlenecks</div>
                  <div className="text-white">Analysis complete: 18,420 tickets resolved, automated 84% repetitive steps.</div>
                  <div className="text-emerald-400">Projected savings: 420 engineering hours/month.</div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{isPlaying ? 'Pause Simulation' : 'Run Live Simulation'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenGetStarted();
                }}
                className="w-full sm:w-auto text-xs sm:text-sm text-white hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Ready to deploy? Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. Get Started Modal */}
      <Modal
        isOpen={activeModal === 'get-started'}
        onClose={resetAll}
        title="Get Started with Zioza"
        maxWidth="max-w-md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-white text-black flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Welcome aboard!</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              We’ve reserved your workspace <span className="font-semibold text-white">"{workspaceName || 'Team HQ'}"</span> and sent verification details to <span className="font-semibold text-white">{email}</span>.
            </p>
            <button
              onClick={resetAll}
              className="mt-4 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Enter Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleGetStartedSubmit} className="space-y-4">
            <p className="text-sm text-white/80">
              Join over 20k active teams transforming raw data into automated workflows.
            </p>

            {step === 1 ? (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-neutral-200 transition-colors text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">Workspace or Team Name</label>
                  <input
                    type="text"
                    required
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Acme Innovations"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 px-4 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 text-sm font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-white text-black font-semibold py-3 rounded-full hover:bg-neutral-200 transition-colors text-sm cursor-pointer"
                  >
                    Create Free Workspace
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" /> No credit card required
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-white" /> SOC-2 Type II
              </span>
            </div>
          </form>
        )}
      </Modal>

      {/* 3. Contact Us Modal */}
      <Modal
        isOpen={activeModal === 'contact'}
        onClose={resetAll}
        title="Contact Our Team"
        maxWidth="max-w-lg"
      >
        {contactSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-white text-black flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Received!</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Thank you, <span className="font-semibold text-white">{contactName}</span>. A member of the Zioza enterprise team will reach out to <span className="font-semibold text-white">{contactEmail}</span> shortly.
            </p>
            <button
              onClick={resetAll}
              className="mt-4 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Your Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Work Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="jane@enterprise.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">How can we help?</label>
              <textarea
                rows={3}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Tell us about your team's workflow automation goals..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-neutral-200 transition-colors text-sm cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </Modal>

      {/* 4. Product Modal */}
      <Modal
        isOpen={activeModal === 'product'}
        onClose={resetAll}
        title="Zioza Intelligence Platform"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            Zioza is the unified intelligence layer that bridges your existing SaaS stack with state-of-the-art autonomous agents and pipelines.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15">
              <Zap className="w-5 h-5 text-white mb-2" />
              <h4 className="font-semibold text-white text-sm">Real-time Stream Engine</h4>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Sub-millisecond event streaming that connects HubSpot, Zendesk, Jira, and cloud databases effortlessly.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15">
              <Sparkles className="w-5 h-5 text-white mb-2" />
              <h4 className="font-semibold text-white text-sm">Agentic Workflows</h4>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Self-correcting automation that handles complex decision trees, exceptions, and multi-step tasks.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onClose();
                onOpenGetStarted();
              }}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </Modal>

      {/* 5. About Us Modal */}
      <Modal
        isOpen={activeModal === 'about'}
        onClose={resetAll}
        title="About Zioza"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5 text-white/80 text-sm sm:text-base leading-relaxed">
          <p>
            Founded by veteran engineers and machine intelligence researchers, Zioza was built on a single realization: modern companies don't lack ideas; they lack the bandwidth to connect data and execute seamlessly.
          </p>
          <p>
            Today, over 20,000 active users rely on Zioza to automate critical operations, eliminate siloed bottlenecks, and turn strategic insights into immediate impact.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div>
              <div className="text-2xl font-bold text-white">20k+</div>
              <div className="text-xs text-white/60">Active Teams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100M+</div>
              <div className="text-xs text-white/60">Events Processed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.99%</div>
              <div className="text-xs text-white/60">Uptime SLA</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 6. FAQ Modal */}
      <Modal
        isOpen={activeModal === 'faq'}
        onClose={resetAll}
        title="Frequently Asked Questions"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-3">
          {[
            {
              q: 'How does Zioza integrate with our existing stack?',
              a: 'Zioza features pre-built bi-directional connectors for HubSpot, Jira Software, Dropbox, Zendesk, Hotjar, DeepL, and dozens of cloud data sources. Setup takes less than 5 minutes with zero code required.',
            },
            {
              q: 'What makes Zioza different from traditional automation tools?',
              a: 'Unlike rigid if-this-then-that scripts, Zioza uses context-aware intelligence that adapts to changing business logic, detects anomalies, and automatically resolves pipeline exceptions.',
            },
            {
              q: 'Is my enterprise data secure?',
              a: 'Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC-2 Type II certified and never use your proprietary data to train third-party foundation models.',
            },
            {
              q: 'Can we try Zioza before committing to an enterprise plan?',
              a: 'Absolutely. We offer a 14-day full-feature trial for teams of any size, with dedicated onboarding support.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-2xl p-4 bg-white/5 transition-colors cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between font-semibold text-white text-sm sm:text-base">
                <span>{item.q}</span>
                <span className="text-lg text-white/70 ml-2">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </div>
              {openFaq === idx && (
                <p className="mt-2.5 text-xs sm:text-sm text-white/75 leading-relaxed pt-2 border-t border-white/10">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* 7. Features Modal */}
      <Modal
        isOpen={activeModal === 'features'}
        onClose={resetAll}
        title="Key Features & Capabilities"
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Autonomous Workflows',
              desc: 'End-to-end task execution with real-time feedback loops and fallback safeguards.',
            },
            {
              title: 'Enterprise Connectors',
              desc: 'Over 100+ native connectors with rate-limiting tolerance and instant sync.',
            },
            {
              title: 'Contextual AI Models',
              desc: 'Custom fine-tuned reasoning tailored to your company documents and APIs.',
            },
            {
              title: 'Audit & Compliance',
              desc: 'Complete immutable audit trails, role-based access control, and GDPR compliance.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-1.5">
              <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
              <p className="text-xs text-white/70 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* 8. Active Users Modal */}
      <Modal
        isOpen={activeModal === 'active-users'}
        onClose={resetAll}
        title="Community & Global Adoption"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5 text-center py-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-black font-extrabold text-xl mx-auto">
            20k+
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Trusted Globally</h3>
            <p className="text-sm text-white/75 mt-1">
              Active engineering, product, and operations leaders deploying intelligent automations daily across 84 countries.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2 text-white/80">
            <div className="flex justify-between py-1 border-b border-white/10">
              <span>Active Organizations</span>
              <span className="font-semibold text-white">4,850+</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span>Daily Automated Actions</span>
              <span className="font-semibold text-white">3.4 Million</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Average Time Saved</span>
              <span className="font-semibold text-white">18.5 hrs / user / mo</span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenGetStarted();
            }}
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-neutral-200 transition-colors text-sm cursor-pointer"
          >
            Join Over 20k Users Now
          </button>
        </div>
      </Modal>
    </>
  );
};
