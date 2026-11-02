import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF4ED] pt-3 pb-8 sm:pt-6 sm:pb-12 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* 1. Scalloped Cloud Trust Container (Pure Vector SVG + HTML Text) */}
        <div className="relative w-full max-w-4xl min-h-[96px] sm:min-h-[110px] md:min-h-[120px] flex items-center justify-center px-4 sm:px-8 py-4 sm:py-5">
          {/* Exact Scalloped Cloud Vector Background */}
          <svg
            viewBox="0 0 966 125"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full text-[#D4EFF4] fill-current drop-shadow-[0_4px_16px_rgba(100,22,35,0.05)] select-none pointer-events-none"
            aria-hidden="true"
          >
            <path d="M 0.0,59.0 L 2.0,56.0 L 3.0,53.0 L 4.0,50.0 L 5.0,47.0 L 7.0,44.0 L 9.0,43.0 L 11.0,40.0 L 14.0,38.0 L 17.0,36.0 L 20.0,34.0 L 21.0,31.0 L 22.0,28.0 L 23.0,25.0 L 25.0,22.0 L 27.0,19.0 L 30.0,16.0 L 33.0,14.0 L 36.0,12.0 L 39.0,11.0 L 42.0,11.0 L 45.0,10.0 L 48.0,9.0 L 50.0,8.0 L 53.0,8.0 L 56.0,9.0 L 59.0,9.0 L 62.0,9.0 L 64.0,11.0 L 67.0,11.0 L 70.0,12.0 L 73.0,14.0 L 76.0,16.0 L 79.0,17.0 L 82.0,16.0 L 85.0,15.0 L 88.0,15.0 L 91.0,15.0 L 94.0,15.0 L 97.0,16.0 L 100.0,16.0 L 102.0,13.0 L 105.0,11.0 L 107.0,9.0 L 110.0,7.0 L 112.0,5.0 L 115.0,4.0 L 118.0,3.0 L 121.0,3.0 L 124.0,2.0 L 127.0,1.0 L 130.0,1.0 L 133.0,0.0 L 136.0,0.0 L 139.0,0.0 L 142.0,0.0 L 145.0,1.0 L 148.0,1.0 L 151.0,2.0 L 154.0,3.0 L 157.0,3.0 L 159.0,4.0 L 162.0,5.0 L 165.0,7.0 L 168.0,9.0 L 171.0,11.0 L 174.0,14.0 L 177.0,12.0 L 180.0,12.0 L 183.0,13.0 L 186.0,13.0 L 189.0,14.0 L 192.0,15.0 L 195.0,15.0 L 198.0,16.0 L 201.0,17.0 L 204.0,17.0 L 207.0,17.0 L 210.0,18.0 L 213.0,18.0 L 216.0,18.0 L 219.0,18.0 L 222.0,17.0 L 225.0,15.0 L 228.0,15.0 L 231.0,14.0 L 234.0,14.0 L 237.0,16.0 L 240.0,16.0 L 243.0,16.0 L 246.0,16.0 L 249.0,16.0 L 252.0,17.0 L 255.0,16.0 L 258.0,14.0 L 261.0,11.0 L 264.0,11.0 L 267.0,11.0 L 270.0,10.0 L 272.0,8.0 L 275.0,8.0 L 278.0,8.0 L 281.0,8.0 L 284.0,9.0 L 287.0,9.0 L 290.0,10.0 L 293.0,11.0 L 296.0,11.0 L 298.0,13.0 L 301.0,15.0 L 304.0,17.0 L 307.0,17.0 L 310.0,16.0 L 313.0,15.0 L 316.0,15.0 L 319.0,15.0 L 322.0,16.0 L 325.0,17.0 L 328.0,15.0 L 330.0,12.0 L 332.0,11.0 L 335.0,8.0 L 338.0,6.0 L 341.0,5.0 L 344.0,3.0 L 347.0,3.0 L 350.0,2.0 L 353.0,1.0 L 356.0,1.0 L 359.0,0.0 L 362.0,0.0 L 365.0,0.0 L 368.0,0.0 L 371.0,0.0 L 374.0,0.0 L 377.0,1.0 L 380.0,1.0 L 383.0,2.0 L 386.0,3.0 L 389.0,4.0 L 392.0,6.0 L 395.0,7.0 L 398.0,8.0 L 400.0,11.0 L 403.0,13.0 L 406.0,15.0 L 409.0,15.0 L 412.0,14.0 L 415.0,14.0 L 418.0,14.0 L 421.0,15.0 L 424.0,17.0 L 427.0,16.0 L 430.0,15.0 L 433.0,16.0 L 436.0,16.0 L 439.0,16.0 L 442.0,16.0 L 445.0,16.0 L 448.0,16.0 L 451.0,15.0 L 454.0,14.0 L 457.0,13.0 L 460.0,12.0 L 463.0,11.0 L 466.0,12.0 L 469.0,13.0 L 472.0,13.0 L 475.0,15.0 L 478.0,16.0 L 481.0,17.0 L 484.0,16.0 L 487.0,16.0 L 490.0,16.0 L 493.0,15.0 L 496.0,14.0 L 498.0,12.0 L 501.0,11.0 L 504.0,10.0 L 507.0,10.0 L 510.0,9.0 L 513.0,8.0 L 516.0,8.0 L 519.0,9.0 L 522.0,9.0 L 525.0,9.0 L 528.0,11.0 L 531.0,11.0 L 534.0,12.0 L 537.0,14.0 L 540.0,16.0 L 543.0,17.0 L 546.0,16.0 L 549.0,15.0 L 552.0,15.0 L 555.0,15.0 L 558.0,16.0 L 561.0,16.0 L 564.0,13.0 L 566.0,11.0 L 569.0,8.0 L 572.0,6.0 L 575.0,5.0 L 578.0,4.0 L 581.0,3.0 L 584.0,2.0 L 587.0,2.0 L 590.0,1.0 L 593.0,1.0 L 596.0,0.0 L 599.0,0.0 L 602.0,0.0 L 605.0,0.0 L 608.0,0.0 L 611.0,0.0 L 614.0,1.0 L 617.0,1.0 L 620.0,3.0 L 623.0,3.0 L 625.0,5.0 L 628.0,6.0 L 631.0,7.0 L 634.0,9.0 L 637.0,11.0 L 639.0,13.0 L 641.0,15.0 L 644.0,16.0 L 647.0,15.0 L 650.0,15.0 L 653.0,15.0 L 656.0,16.0 L 659.0,16.0 L 662.0,17.0 L 665.0,16.0 L 668.0,13.0 L 671.0,11.0 L 674.0,11.0 L 677.0,10.0 L 680.0,9.0 L 683.0,8.0 L 686.0,8.0 L 689.0,8.0 L 692.0,8.0 L 695.0,9.0 L 698.0,10.0 L 701.0,11.0 L 704.0,11.0 L 707.0,13.0 L 710.0,15.0 L 713.0,17.0 L 716.0,17.0 L 719.0,17.0 L 722.0,17.0 L 725.0,18.0 L 728.0,17.0 L 731.0,14.0 L 734.0,12.0 L 737.0,11.0 L 740.0,11.0 L 743.0,10.0 L 746.0,9.0 L 749.0,8.0 L 752.0,8.0 L 755.0,8.0 L 758.0,9.0 L 761.0,10.0 L 764.0,11.0 L 767.0,11.0 L 770.0,12.0 L 773.0,15.0 L 776.0,17.0 L 779.0,17.0 L 782.0,16.0 L 785.0,15.0 L 788.0,15.0 L 791.0,15.0 L 794.0,16.0 L 797.0,15.0 L 800.0,13.0 L 801.0,10.0 L 804.0,8.0 L 807.0,6.0 L 810.0,5.0 L 813.0,4.0 L 816.0,2.0 L 819.0,1.0 L 822.0,1.0 L 825.0,1.0 L 828.0,1.0 L 831.0,1.0 L 834.0,0.0 L 837.0,1.0 L 840.0,1.0 L 843.0,1.0 L 846.0,1.0 L 849.0,2.0 L 852.0,3.0 L 855.0,4.0 L 858.0,6.0 L 861.0,7.0 L 863.0,8.0 L 864.0,11.0 L 867.0,12.0 L 870.0,15.0 L 873.0,15.0 L 876.0,15.0 L 879.0,15.0 L 882.0,16.0 L 885.0,17.0 L 888.0,17.0 L 891.0,17.0 L 894.0,15.0 L 897.0,12.0 L 900.0,11.0 L 903.0,11.0 L 906.0,10.0 L 909.0,9.0 L 912.0,9.0 L 915.0,9.0 L 918.0,9.0 L 921.0,10.0 L 924.0,11.0 L 927.0,11.0 L 930.0,11.0 L 932.0,13.0 L 935.0,15.0 L 938.0,17.0 L 940.0,20.0 L 943.0,23.0 L 943.0,26.0 L 945.0,28.0 L 946.0,31.0 L 947.0,34.0 L 949.0,37.0 L 952.0,38.0 L 955.0,40.0 L 957.0,43.0 L 959.0,44.0 L 961.0,47.0 L 963.0,50.0 L 964.0,53.0 L 965.0,56.0 L 966.0,59.0 L 966.0,62.0 L 966.0,65.0 L 966.0,68.0 L 966.0,71.0 L 966.0,74.0 L 964.0,76.0 L 964.0,79.0 L 963.0,82.0 L 962.0,85.0 L 959.0,88.0 L 958.0,90.0 L 956.0,92.0 L 953.0,94.0 L 950.0,96.0 L 947.0,98.0 L 946.0,101.0 L 946.0,104.0 L 944.0,106.0 L 943.0,109.0 L 940.0,112.0 L 937.0,115.0 L 934.0,117.0 L 931.0,118.0 L 928.0,119.0 L 926.0,121.0 L 923.0,122.0 L 920.0,122.0 L 917.0,122.0 L 914.0,122.0 L 911.0,122.0 L 908.0,122.0 L 905.0,121.0 L 902.0,120.0 L 899.0,119.0 L 896.0,118.0 L 893.0,116.0 L 890.0,114.0 L 887.0,113.0 L 884.0,114.0 L 881.0,116.0 L 878.0,116.0 L 875.0,115.0 L 872.0,114.0 L 869.0,114.0 L 866.0,116.0 L 863.0,118.0 L 861.0,119.0 L 858.0,121.0 L 855.0,122.0 L 852.0,122.0 L 849.0,122.0 L 847.0,124.0 L 844.0,124.0 L 841.0,124.0 L 838.0,125.0 L 835.0,125.0 L 832.0,125.0 L 829.0,124.0 L 826.0,123.0 L 823.0,122.0 L 820.0,122.0 L 817.0,121.0 L 814.0,119.0 L 811.0,118.0 L 808.0,116.0 L 806.0,114.0 L 803.0,112.0 L 800.0,113.0 L 797.0,114.0 L 794.0,115.0 L 791.0,116.0 L 788.0,116.0 L 785.0,116.0 L 782.0,115.0 L 779.0,115.0 L 776.0,116.0 L 773.0,118.0 L 770.0,120.0 L 767.0,121.0 L 765.0,122.0 L 762.0,122.0 L 759.0,122.0 L 756.0,122.0 L 753.0,122.0 L 750.0,122.0 L 747.0,122.0 L 744.0,122.0 L 741.0,121.0 L 738.0,120.0 L 735.0,118.0 L 732.0,116.0 L 729.0,114.0 L 727.0,112.0 L 724.0,112.0 L 721.0,112.0 L 719.0,115.0 L 716.0,116.0 L 713.0,117.0 L 710.0,119.0 L 707.0,120.0 L 704.0,122.0 L 701.0,122.0 L 698.0,122.0 L 695.0,123.0 L 692.0,123.0 L 689.0,124.0 L 686.0,123.0 L 683.0,122.0 L 680.0,122.0 L 677.0,122.0 L 674.0,121.0 L 671.0,120.0 L 668.0,118.0 L 666.0,116.0 L 663.0,114.0 L 660.0,114.0 L 657.0,115.0 L 654.0,115.0 L 651.0,115.0 L 648.0,116.0 L 645.0,115.0 L 642.0,114.0 L 639.0,111.0 L 636.0,112.0 L 633.0,115.0 L 630.0,117.0 L 627.0,118.0 L 624.0,119.0 L 621.0,120.0 L 618.0,122.0 L 615.0,122.0 L 612.0,122.0 L 609.0,123.0 L 606.0,123.0 L 603.0,123.0 L 600.0,123.0 L 597.0,123.0 L 594.0,123.0 L 591.0,122.0 L 588.0,122.0 L 585.0,122.0 L 582.0,120.0 L 579.0,118.0 L 576.0,118.0 L 574.0,116.0 L 571.0,114.0 L 568.0,113.0 L 565.0,113.0 L 562.0,115.0 L 559.0,116.0 L 556.0,116.0 L 553.0,116.0 L 550.0,116.0 L 547.0,115.0 L 544.0,114.0 L 541.0,115.0 L 538.0,116.0 L 535.0,118.0 L 532.0,119.0 L 529.0,120.0 L 526.0,122.0 L 523.0,122.0 L 520.0,122.0 L 517.0,122.0 L 514.0,122.0 L 512.0,121.0 L 509.0,120.0 L 506.0,119.0 L 503.0,118.0 L 500.0,118.0 L 497.0,116.0 L 495.0,114.0 L 492.0,114.0 L 489.0,115.0 L 486.0,116.0 L 483.0,115.0 L 480.0,115.0 L 477.0,116.0 L 474.0,117.0 L 471.0,118.0 L 468.0,118.0 L 465.0,117.0 L 462.0,117.0 L 459.0,116.0 L 456.0,115.0 L 453.0,113.0 L 450.0,112.0 L 447.0,112.0 L 444.0,112.0 L 441.0,113.0 L 438.0,114.0 L 435.0,115.0 L 432.0,115.0 L 429.0,116.0 L 426.0,117.0 L 423.0,117.0 L 420.0,117.0 L 417.0,116.0 L 414.0,116.0 L 411.0,115.0 L 408.0,114.0 L 405.0,112.0 L 402.0,114.0 L 399.0,116.0 L 397.0,117.0 L 394.0,118.0 L 391.0,120.0 L 388.0,121.0 L 385.0,122.0 L 382.0,122.0 L 379.0,123.0 L 376.0,123.0 L 373.0,124.0 L 370.0,124.0 L 367.0,125.0 L 364.0,125.0 L 361.0,125.0 L 358.0,124.0 L 355.0,124.0 L 352.0,123.0 L 349.0,122.0 L 346.0,122.0 L 343.0,121.0 L 340.0,119.0 L 337.0,118.0 L 334.0,116.0 L 331.0,114.0 L 329.0,112.0 L 326.0,111.0 L 323.0,113.0 L 320.0,115.0 L 317.0,116.0 L 314.0,117.0 L 311.0,117.0 L 308.0,117.0 L 305.0,117.0 L 303.0,115.0 L 300.0,114.0 L 297.0,113.0 L 294.0,112.0 L 291.0,111.0 L 288.0,110.0 L 285.0,110.0 L 282.0,110.0 L 279.0,111.0 L 276.0,112.0 L 273.0,113.0 L 271.0,115.0 L 269.0,116.0 L 266.0,117.0 L 263.0,118.0 L 260.0,119.0 L 257.0,119.0 L 254.0,119.0 L 251.0,118.0 L 248.0,118.0 L 245.0,116.0 L 242.0,114.0 L 239.0,114.0 L 236.0,116.0 L 233.0,118.0 L 230.0,120.0 L 227.0,121.0 L 224.0,122.0 L 221.0,122.0 L 218.0,122.0 L 215.0,123.0 L 212.0,123.0 L 209.0,123.0 L 206.0,122.0 L 203.0,122.0 L 200.0,122.0 L 197.0,120.0 L 194.0,118.0 L 192.0,117.0 L 189.0,115.0 L 186.0,115.0 L 183.0,115.0 L 180.0,115.0 L 177.0,114.0 L 175.0,112.0 L 172.0,112.0 L 169.0,114.0 L 166.0,116.0 L 163.0,117.0 L 160.0,119.0 L 157.0,120.0 L 154.0,122.0 L 151.0,122.0 L 148.0,122.0 L 145.0,123.0 L 142.0,124.0 L 139.0,125.0 L 136.0,125.0 L 133.0,124.0 L 130.0,124.0 L 127.0,123.0 L 124.0,122.0 L 121.0,122.0 L 118.0,122.0 L 115.0,120.0 L 112.0,119.0 L 109.0,118.0 L 107.0,115.0 L 104.0,112.0 L 101.0,111.0 L 98.0,114.0 L 95.0,116.0 L 92.0,116.0 L 89.0,116.0 L 86.0,116.0 L 83.0,115.0 L 80.0,114.0 L 77.0,114.0 L 74.0,116.0 L 71.0,118.0 L 68.0,119.0 L 65.0,120.0 L 62.0,122.0 L 59.0,122.0 L 56.0,122.0 L 53.0,122.0 L 50.0,122.0 L 47.0,122.0 L 44.0,121.0 L 41.0,120.0 L 38.0,119.0 L 35.0,118.0 L 32.0,117.0 L 31.0,114.0 L 28.0,112.0 L 26.0,110.0 L 24.0,107.0 L 22.0,105.0 L 21.0,102.0 L 21.0,99.0 L 18.0,96.0 L 15.0,94.0 L 12.0,92.0 L 9.0,90.0 L 8.0,87.0 L 5.0,84.0 L 4.0,81.0 L 3.0,78.0 L 2.0,75.0 L 0.0,73.0 L 0.0,70.0 L 0.0,67.0 L 0.0,64.0 L 0.0,61.0 Z" />
          </svg>

          {/* 4 Trust Pillars with Real Vector SVGs and HTML Text */}
          <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 items-center text-center">
            {/* Pillar 1: Handmade with love */}
            <div className="flex flex-col items-center justify-center group px-1 sm:px-2">
              <div className="text-[#641623] mb-1.5 transition-transform duration-200 group-hover:scale-110">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#641623] leading-tight">
                handmade
                <br />
                with love
              </p>
            </div>

            {/* Pillar 2: Made by dadis in surat */}
            <div className="flex flex-col items-center justify-center group px-1 sm:px-2 relative">
              {/* Divider on left (desktop) */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[1.5px] bg-[#641623]/25 rounded-full" />
              <div className="text-[#641623] mb-1.5 transition-transform duration-200 group-hover:scale-110">
                {/* Cute Yarn Ball with Crochet Hook */}
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="16" cy="16" r="10.5" />
                  <path d="M 9 12 Q 16 16 23 11" />
                  <path d="M 8 18 Q 15 22 24 17" />
                  <path d="M 12 7 Q 16 16 14 25" />
                  <path d="M 18 8 Q 19 17 21 24" />
                  <line x1="5" y1="27" x2="27" y2="5" strokeWidth="2.4" />
                  <path d="M 27 5 Q 29 3 27 2" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#641623] leading-tight">
                made by
                <br />
                dadis in surat
              </p>
            </div>

            {/* Pillar 3: Sustainable yarn & materials */}
            <div className="flex flex-col items-center justify-center group px-1 sm:px-2 relative">
              {/* Divider on left (desktop) */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[1.5px] bg-[#641623]/25 rounded-full" />
              <div className="text-[#641623] mb-1.5 transition-transform duration-200 group-hover:scale-110">
                {/* Twin Leaves */}
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 7 25 C 10 20 13 16 20 13" />
                  <path d="M 15 14 C 13 6 21 4 25 5 C 26 9 24 16 16 18 Z" />
                  <path d="M 14 17 C 8 13 6 7 9 5 C 13 5 18 9 16 16 Z" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#641623] leading-tight">
                sustainable
                <br />
                yarn & materials
              </p>
            </div>

            {/* Pillar 4: Perfect for gifting */}
            <div className="flex flex-col items-center justify-center group px-1 sm:px-2 relative">
              {/* Divider on left (desktop) */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[1.5px] bg-[#641623]/25 rounded-full" />
              <div className="text-[#641623] mb-1.5 transition-transform duration-200 group-hover:scale-110">
                {/* Gift Box with Ribbon Bow */}
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="14" width="20" height="13" rx="2" />
                  <rect x="4" y="9" width="24" height="5" rx="1.5" />
                  <line x1="16" y1="9" x2="16" y2="27" />
                  <path d="M 16 9 C 13 4 8 4 9 7 C 10 9 14 9 16 9 Z" />
                  <path d="M 16 9 C 19 4 24 4 23 7 C 22 9 18 9 16 9 Z" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#641623] leading-tight">
                perfect
                <br />
                for gifting
              </p>
            </div>
          </div>
        </div>

        {/* 2. Full-Width Section Divider (Dashed Stitch Line + Hand-Drawn Ribbon Bow) */}
        <div className="w-full max-w-5xl mt-6 sm:mt-8 flex items-center justify-center px-4">
          {/* Left Dashed Stitch Line */}
          <div className="flex-1 h-0 border-b-[2.5px] border-dashed border-[#641623]/70" />

          {/* Centered Hand-Drawn Ribbon Bow */}
          <div className="px-3 sm:px-4 flex-shrink-0 text-[#641623]">
            <svg
              viewBox="0 0 100 60"
              className="w-14 h-9 sm:w-16 sm:h-10 text-[#641623] fill-none transition-transform duration-300 hover:scale-110"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Bow Loop */}
              <path
                d="M 50 31 C 40 16 18 12 17 23 C 16 32 38 33 50 31 Z"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Bow Loop */}
              <path
                d="M 50 31 C 60 16 82 12 83 23 C 84 32 62 33 50 31 Z"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Left Flowing Ribbon Tail */}
              <path
                d="M 50 31 Q 44 42 30 55"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Right Flowing Ribbon Tail */}
              <path
                d="M 50 31 Q 56 42 70 55"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Right Dashed Stitch Line */}
          <div className="flex-1 h-0 border-b-[2.5px] border-dashed border-[#641623]/70" />
        </div>
      </div>
    </section>
  );
};
