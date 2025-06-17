import { Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Base path for assets in production
const BASE_PATH = window.location.hostname === 'trenton5412.github.io' ? '/trenton.who/' : '/';

// Define navigation items for reuse
const navigationItems = [
  {
    id: "about",
    label: "About",
    imgSrc: `${BASE_PATH}ButtonImage/About.png`,
  },
  {
    id: "work",
    label: "Work",
    imgSrc: `${BASE_PATH}ButtonImage/WORK.png`,
  },
  {
    id: "home",
    label: "Home",
    imgSrc: `${BASE_PATH}ButtonImage/HOME.png`,
  },
];

// About page content
const aboutContent = {
  bio: <p>To Ukraine, it's 365 days — to Taiwan, only 8,760 hours pass.<br />Wait, no — where is Taiwan.<br />Oh? You mean China, right?<br />Because Taiwan doesn't exist — or so you'd say：）<br />I Love Taiwan.</p>,
  contact: {
    email: "trenton5412@gmail.com",
    social: [
      { id: "ig", imgSrc: `${BASE_PATH}ButtonImage/IG.png`, type: "image", url: "https://www.instagram.com/off_trent_on" },
      { id: "yt", imgSrc: `${BASE_PATH}ButtonImage/YT.png`, type: "image", url: "https://www.youtube.com/@lllolll_TrenT%C3%B6n" },
    ],
  },
};

// Work portfolio items with optimized loading
const workPortfolio = [
  {
    id: 1,
    title: "Anime Love Preview",
    category: "Music Video",
    thumbnail: `${BASE_PATH}Work/Anime Love 試聽集.png`,
    video: `${BASE_PATH}Work/Anime Love 試聽集.mp4`
  },
  {
    id: 2,
    title: "SANDWICH",
    category: "3D Animation",
    thumbnail: `${BASE_PATH}Work/SANDWICH.png`,
    video: `${BASE_PATH}Work/SANDWICH.mp4`
  },
  {
    id: 3,
    title: "SANDWICH Loop",
    category: "3D Animation",
    thumbnail: `${BASE_PATH}Work/SANDWICH_Loop.png`,
    video: `${BASE_PATH}Work/SANDWICH_Loop.mp4`
  },
  {
    id: 4,
    title: "乖乖乖乖乖",
    category: "2D&3D Animation",
    thumbnail: `${BASE_PATH}Work/乖乖乖乖乖.png`,
    video: `${BASE_PATH}Work/乖乖乖乖乖.mp4`
  },
  {
    id: 5,
    title: "全國古蹟日",
    category: "Graphic Animation",
    thumbnail: `${BASE_PATH}Work/全國古蹟日.png`,
    video: `${BASE_PATH}Work/全國古蹟日.mp4`
  },
  {
    id: 6,
    title: "漸速耐力折返跑",
    category: "Collage",
    thumbnail: `${BASE_PATH}Work/漸速耐力折返跑.png`,
    video: `${BASE_PATH}Work/漸速耐力折返跑.mp4`
  },
  {
    id: 7,
    title: "卡帶設計",
    category: "3D Design",
    thumbnail: `${BASE_PATH}Work/卡帶外觀1.jpg`,
    video: null
  },
  {
    id: 8,
    title: "Cassette Player Model",
    category: "3D Design",
    thumbnail: `${BASE_PATH}Work/卡帶錄放機Model.jpg`,
    video: null
  },
  {
    id: 9,
    title: "大學生視覺",
    category: "Graphic Design",
    thumbnail: `${BASE_PATH}Work/大學生視覺.jpg`,
    video: null
  }
];

// 定義共用的影片屬性
const videoProps = {
  className: "pointer-events-none select-none fixed w-[120vw] max-w-none",
  autoPlay: true,
  loop: true,
  muted: true,
  playsInline: true,
  onError: (e: any) => {
    console.error('Video error:', e);
    const video = e.target as HTMLVideoElement;
    console.log('Video error details:', {
      error: video.error,
      networkState: video.networkState,
      readyState: video.readyState,
      src: video.src
    });
  },
  onLoadedData: () => console.log('Video loaded successfully'),
  onLoadStart: () => console.log('Video loading started'),
  onCanPlay: () => console.log('Video can play'),
  onWaiting: () => console.log('Video waiting for data'),
  onStalled: () => console.log('Video stalled'),
  preload: "auto" as const
};

// 動態計算 tapeStyles 的函數（移到組件內部使用）

export const Box = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentPage, setCurrentPage] = useState("intro");
  const [workTapeDone, setWorkTapeDone] = useState(false);
  const [workTapeStart, setWorkTapeStart] = useState(false);
  const [prevPage, setPrevPage] = useState("intro");
  const lavaRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const uiSoundRef = useRef<HTMLAudioElement | null>(null);
  const tapeVideo1Ref = useRef<HTMLVideoElement | null>(null);
  const tapeVideo2Ref = useRef<HTMLVideoElement | null>(null);
  const tapeVideo3Ref = useRef<HTMLVideoElement | null>(null);
  const tapeVideo4Ref = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Work page states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkItem, setSelectedWorkItem] = useState<typeof workPortfolio[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 響應式 scale 計算
  const [tapeScale, setTapeScale] = useState(1.5);

  // Get unique categories for filtering
  const categories = ["All", ...Array.from(new Set(workPortfolio.map(item => item.category)))];

  // Filter portfolio items based on selected category
  const filteredPortfolio = selectedCategory === "All" 
    ? workPortfolio 
    : workPortfolio.filter(item => item.category === selectedCategory);

  // Handle work item selection
  const handleWorkItemClick = (item: typeof workPortfolio[0]) => {
    setSelectedWorkItem(item);
    setIsModalOpen(true);
    // Mark video as loaded when modal opens
    if (item.video) {
      setLoadedVideos(prev => new Set([...prev, item.id]));
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedWorkItem(null);
    // Reset playing state with a slight delay for smooth transition
    setTimeout(() => {
      setIsPlaying(false);
    }, 100);
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === filteredPortfolio.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false); // Reset playing state when switching
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredPortfolio.length - 1 : prevIndex - 1
    );
    setIsPlaying(false); // Reset playing state when switching
  };

  // Handle play action
  const handlePlay = () => {
    setIsPlaying(true);
    const currentItem = getCurrentItem();
    if (currentItem) {
      handleWorkItemClick(currentItem);
    }
  };

  // Get current, previous, and next items for carousel display
  const getCurrentItem = () => filteredPortfolio[currentIndex] || null;
  const getPrevItem = () => {
    if (filteredPortfolio.length === 0) return null;
    const prevIndex = currentIndex === 0 ? filteredPortfolio.length - 1 : currentIndex - 1;
    return filteredPortfolio[prevIndex];
  };
  const getNextItem = () => {
    if (filteredPortfolio.length === 0) return null;
    const nextIndex = currentIndex === filteredPortfolio.length - 1 ? 0 : currentIndex + 1;
    return filteredPortfolio[nextIndex];
  };

  // Reset currentIndex when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setIsPlaying(false); // Reset playing state when changing category
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentPage === 'work') {
        if (!isModalOpen) {
          if (event.key === 'ArrowLeft') {
            prevSlide();
          } else if (event.key === 'ArrowRight') {
            nextSlide();
          }
        } else {
          // Handle ESC key in modal
          if (event.key === 'Escape') {
            handleModalClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isModalOpen]);

  // Reset playing state when current item changes
  useEffect(() => {
    setIsPlaying(false);
  }, [currentIndex]);

  // 計算響應式 scale 值的函數
  const calculateTapeScale = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    if (isLandscape) {
      // 橫式：不管什麼裝置都是 1.5
      return 1.5;
    } else {
      // 直式：根據螢幕寧度區分平板和手機
      if (width >= 768) {
        // 直式平板
        return 2.5;
      } else {
        // 直式手機
        return 3.5;
      }
    }
  };

  // 監聽視窗大小變化和方向變化
  useEffect(() => {
    const handleResize = () => {
      setTapeScale(calculateTapeScale());
    };

    // 初始設定
    handleResize();
    
    // 監聽 resize 事件
    window.addEventListener('resize', handleResize);
    // 監聽方向變化事件
    window.addEventListener('orientationchange', () => {
      // 方向變化後稍微延遲，確保新的尺寸已經更新
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // 自動從 intro 切換到 home 頁面
  useEffect(() => {
    if (currentPage === "intro") {
      const timer = setTimeout(() => {
        setCurrentPage("home");
      }, 2980); // 2980ms 後切換到 home 頁面

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'home' || currentPage === 'work' || currentPage === 'about') {
      setWorkTapeDone(false);
      setWorkTapeStart(false);
      setTimeout(() => setWorkTapeStart(true), 100);
      // 設置動畫完成時間，確保膠帶保持播放
      setTimeout(() => setWorkTapeDone(true), 2100);
    }
  }, [currentPage]);

  {/* 背景音效 和 UI 音效 */}
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = currentPage === "work";
    }
  }, [currentPage]);

  const handleFirstClick = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      if (bgmRef.current) {
        bgmRef.current.play();
      }
    }
  };

  const handlePageChange = (newPage: string) => {
    setPrevPage(currentPage);
    setActiveTab(newPage);
    setCurrentPage(newPage);
    
    if (uiSoundRef.current) {
      uiSoundRef.current.currentTime = 0;
      uiSoundRef.current.volume = 0.5;
      uiSoundRef.current.play();
    }
    if (bgmRef.current) {
      bgmRef.current.muted = newPage === "work";
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
  
    const observer = new ResizeObserver(() => {
      canvas.style.width = `${video.clientWidth}px`;
      canvas.style.height = `${video.clientHeight}px`;

      if (video.clientWidth > 1100) {
        canvas.style.width = `${1100}px`;
        canvas.style.height = `${1100*video.clientHeight/video.clientWidth}px`;
      }
      if (video.clientHeight > 593) {
        canvas.style.height = `${593}px`;
        canvas.style.width = `${593*video.clientWidth/video.clientHeight}px`;
      }
    });
  
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // 修改影片控制邏輯 - 移除對膠帶視頻的重複控制
  useEffect(() => {
    // 背景視頻的控制邏輯在這裡處理
  }, [currentPage]);

  // 新增：確保膠帶視頻在首次加載時開始播放並持續播放
  useEffect(() => {
    const startTapeVideos = () => {
      [tapeVideo1Ref, tapeVideo2Ref, tapeVideo3Ref, tapeVideo4Ref].forEach(ref => {
        if (ref.current) {
          ref.current.play().catch(() => {
            // 靜默處理播放錯誤
          });
        }
      });
    };

    // 延遲啟動，確保視頻元素已載入
    const timer = setTimeout(startTapeVideos, 100);
    return () => clearTimeout(timer);
  }, []); // 只在組件首次加載時執行一次

  // 動態計算 tapeStyles，使用響應式的 scale 值
  const tapeStyles = {
    tape1: { transform: `scale(${tapeScale})`, zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' },
    tape2: { transform: `scale(${tapeScale})`, zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' },
    tape3: { transform: `scale(${tapeScale})`, zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' },
    tape4: { transform: `scale(${tapeScale})`, zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' }
  };

  const getBgVideoSrc = (page: string) => {
    switch (page) {
      case "intro":
        return [
          // 橫式 - 所有裝置都使用 1280-1080
          { src: `${BASE_PATH}BG/Bar.webm`, type: "video/webm", media: "(orientation: landscape)" },
          { src: `${BASE_PATH}BG/1280-1080_intro.mp4`, type: "video/mp4", media: "(orientation: landscape)" },
          // 直式平板 - 使用 800-1080
          { src: `${BASE_PATH}BG/800-1080_intro.webm`, type: "video/webm", media: "(orientation: portrait) and (min-width: 768px)" },
          { src: `${BASE_PATH}BG/800-1080_intro.mp4`, type: "video/mp4", media: "(orientation: portrait) and (min-width: 768px)" },
          // 直式手機 - 使用 375-1080
          { src: `${BASE_PATH}BG/375-1080_intro.webm`, type: "video/webm", media: "(orientation: portrait) and (max-width: 767px)" },
          { src: `${BASE_PATH}BG/375-1080_intro.mp4`, type: "video/mp4", media: "(orientation: portrait) and (max-width: 767px)" }
        ];
      case "home":
        return [
          // 橫式 - 所有裝置都使用 1280-1080
          { src: `${BASE_PATH}BG/1280-1080Main_sound_optimized.mp4`, type: "video/mp4", media: "(orientation: landscape)" },
          { src: `${BASE_PATH}BG/1280-1080Main_sound.webm`, type: "video/webm", media: "(orientation: landscape)" },
          // 直式平板 - 使用 800-1080
          { src: `${BASE_PATH}BG/800-1080Main_sound_optimized.webm`, type: "video/webm", media: "(orientation: portrait) and (min-width: 768px)" },
          { src: `${BASE_PATH}BG/800-1080Main_sound_optimized.mp4`, type: "video/mp4", media: "(orientation: portrait) and (min-width: 768px)" },
          // 直式手機 - 使用 375-1080
          { src: `${BASE_PATH}BG/375-1080Main_sound_optimized.mp4`, type: "video/mp4", media: "(orientation: portrait) and (max-width: 767px)" },
          { src: `${BASE_PATH}BG/375-1080Main_sound.webm`, type: "video/webm", media: "(orientation: portrait) and (max-width: 767px)" }
        ];
      case "work":
        return [
          // 橫式 - 所有裝置都使用 1280-1080
          { src: `${BASE_PATH}BG/1280-1080Clean.webm`, type: "video/webm", media: "(orientation: landscape)" },
          { src: `${BASE_PATH}BG/1280-1080Clean.mp4`, type: "video/mp4", media: "(orientation: landscape)" },
          // 直式平板 - 使用 800-1080
          { src: `${BASE_PATH}BG/800-1080Clean.webm`, type: "video/webm", media: "(orientation: portrait) and (min-width: 768px)" },
          { src: `${BASE_PATH}BG/800-1080Clean.mp4`, type: "video/mp4", media: "(orientation: portrait) and (min-width: 768px)" },
          // 直式手機 - 使用 375-1080
          { src: `${BASE_PATH}BG/375-1080Clean.webm`, type: "video/webm", media: "(orientation: portrait) and (max-width: 767px)" },
          { src: `${BASE_PATH}BG/375-1080Clean.mp4`, type: "video/mp4", media: "(orientation: portrait) and (max-width: 767px)" }
        ];
      case "about":
        return [
          // 橫式 - 所有裝置都使用 1280-1080
          { src: `${BASE_PATH}BG/1280-1080Clean_sound.webm`, type: "video/webm", media: "(orientation: landscape)" },
          { src: `${BASE_PATH}BG/1280-1080Clean_sound.mp4`, type: "video/mp4", media: "(orientation: landscape)" },
          // 直式平板 - 使用 800-1080
          { src: `${BASE_PATH}BG/800-1080Clean_sound.webm`, type: "video/webm", media: "(orientation: portrait) and (min-width: 768px)" },
          { src: `${BASE_PATH}BG/800-1080Clean_sound.mp4`, type: "video/mp4", media: "(orientation: portrait) and (min-width: 768px)" },
          // 直式手機 - 使用 375-1080
          { src: `${BASE_PATH}BG/375-1080Clean_sound.webm`, type: "video/webm", media: "(orientation: portrait) and (max-width: 767px)" },
          { src: `${BASE_PATH}BG/375-1080Clean_sound.mp4`, type: "video/mp4", media: "(orientation: portrait) and (max-width: 767px)" }
        ];
      default:
        return [
          // 橫式 - 所有裝置都使用 1280-1080
          { src: `${BASE_PATH}BG/Bar.webm`, type: "video/webm", media: "(orientation: landscape)" },
          { src: `${BASE_PATH}BG/1280-1080_intro.mp4`, type: "video/mp4", media: "(orientation: landscape)" },
          // 直式平板 - 使用 800-1080
          { src: `${BASE_PATH}BG/800-1080_intro.webm`, type: "video/webm", media: "(orientation: portrait) and (min-width: 768px)" },
          { src: `${BASE_PATH}BG/800-1080_intro.mp4`, type: "video/mp4", media: "(orientation: portrait) and (min-width: 768px)" },
          // 直式手機 - 使用 375-1080
          { src: `${BASE_PATH}BG/375-1080_intro.webm`, type: "video/webm", media: "(orientation: portrait) and (max-width: 767px)" },
          { src: `${BASE_PATH}BG/375-1080_intro.mp4`, type: "video/mp4", media: "(orientation: portrait) and (max-width: 767px)" }
        ];
    }
  };

  // 處理影片錯誤
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement | HTMLSourceElement;
    
    if (target.tagName === 'VIDEO') {
      console.warn('Video loading failed, retrying...');
      setVideoError(true);
    }
  };

  // 重置錯誤狀態
  useEffect(() => {
    if (videoError && retryCount >= 3) {
      const timer = setTimeout(() => {
        setVideoError(false);
        setRetryCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [videoError, retryCount]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      data-model-id="5:857-frame"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
      onClick={handleFirstClick}
    >
      {/* 背景音樂 */}
      <audio
        ref={bgmRef}
        src={`${BASE_PATH}SoundEffect/BGM.mp3`}
        loop
        preload="auto"
        className="hidden"
        muted={currentPage === "work"}
      />
      {/* UI 音效 */}
      <audio
        ref={uiSoundRef}
        src={`${BASE_PATH}SoundEffect/ui-sound-on-270295.mp3`}
        preload="auto"
        className="hidden"
      />
      {/* Intro Page 的前景膠帶佈局 */}
      {currentPage === 'intro' && (
        <>
          {/* 右上角兩條 */}
          <video
            ref={tapeVideo1Ref}
            {...videoProps}
            style={{...tapeStyles.tape1, rotate: '58deg'}}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo2Ref}
            {...videoProps}
            style={{...tapeStyles.tape2, rotate: '5deg'}}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          {/* 左下角兩條 */}
          <video
            ref={tapeVideo3Ref}
            {...videoProps}
            style={{...tapeStyles.tape3, rotate: '0deg'}}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo4Ref}
            {...videoProps}
            style={{...tapeStyles.tape4, rotate: '25deg'}}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
        </>
      )}
      {/*  Home Page 的前景膠帶佈局 */}
      {currentPage === 'home' && !workTapeStart && (
        <>
          {/* 右上角兩條 */}
          <video
            ref={tapeVideo1Ref}
            {...videoProps}
            style={{...tapeStyles.tape1, rotate: '58deg'}}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo2Ref}
            {...videoProps}
            style={{...tapeStyles.tape2, rotate: '5deg'}}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          {/* 左下角兩條 */}
          <video
            ref={tapeVideo3Ref}
            {...videoProps}
            style={{...tapeStyles.tape3, rotate: '0deg'}}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo4Ref}
            {...videoProps}
            style={{...tapeStyles.tape4, rotate: '25deg'}}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
        </>
      )}

      {/* 進入home 的膠帶動畫 */}
      {currentPage === 'home' && workTapeStart && !workTapeDone && (
        <>
          <AnimatePresence>
            {/* tape1 to tape3 */}
            <motion.video
              key="tape1-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? '-20vw' : prevPage === 'about' ? 'auto' : 'auto',
                right: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-135vw' : '-50vw',
                top: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-15vw' : '-5vw',
                bottom: prevPage === 'work' ? '-30vw' : prevPage === 'about' ? 'auto' : 'auto',
                rotate: prevPage === 'work' ? 0 : prevPage === 'about' ? 0 : 58,
                opacity: 1,
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-50vw',
                top: '-5vw',
                bottom: 'auto',
                rotate: 58,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape2 to tape4 */}
            <motion.video
              key="tape2-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? '-40vw' : prevPage === 'about' ? 'auto' : 'auto',
                right: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-140vw' : '-10vw',
                top: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-20vw' : '-28vw',
                bottom: prevPage === 'work' ? '-25vw' : prevPage === 'about' ? 'auto' : 'auto',
                rotate: prevPage === 'work' ? 25 : prevPage === 'about' ? 0 : 5,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-10vw',
                top: '-28vw',
                bottom: 'auto',
                rotate: 5,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape3 to tape1 */}
            <motion.video
              key="tape3-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? 'auto' : prevPage === 'about' ? 'auto' : '-20vw',
                right: prevPage === 'work' ? '-50vw' : prevPage === 'about' ? '-130vw' : 'auto',
                top: prevPage === 'work' ? '-5vw' : prevPage === 'about' ? '-10vw' : 'auto',
                bottom: prevPage === 'work' ? 'auto' : prevPage === 'about' ? 'auto' : '-30vw',
                rotate: prevPage === 'work' ? 58 : prevPage === 'about' ? 0 : 0,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: '-20vw',
                right: 'auto',
                top: 'auto',
                bottom: '-30vw',
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape4 to tape2 */}
            <motion.video
              key="tape4-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-55vw' : '-40vw',
                right: prevPage === 'work' ? '-10vw' : prevPage === 'about' ? 'auto' : 'auto',
                top: prevPage === 'work' ? 'auto' : prevPage === 'about' ? 'auto' : 'auto',
                bottom: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '0vw' : '-25vw',
                rotate: prevPage === 'work' ? 5 : prevPage === 'about' ? -90 : 25,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: '-40vw',
                right: 'auto',
                top: 'auto',
                bottom: '-25vw',
                rotate: 25,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
          </AnimatePresence>
        </>
      )}
      {currentPage === 'home' && workTapeDone && (
        <>
          {/* 結束：新位置、正常大小、無模糊 */}
          <video
            ref={tapeVideo1Ref}
            {...videoProps}
            style={{...tapeStyles.tape1, rotate: '58deg'}}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo2Ref}
            {...videoProps}
            style={{...tapeStyles.tape2, rotate: '5deg'}}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo3Ref}
            {...videoProps}
            style={{...tapeStyles.tape3, rotate: '0deg'}}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo4Ref}
            {...videoProps}
            style={{...tapeStyles.tape4, rotate: '25deg'}}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
        </>
      )}



      {/* 進入work 的膠帶動畫 */}
      {currentPage === 'work' && workTapeStart && !workTapeDone && (
        <>
          <AnimatePresence>
            {/* tape1 to tape3 */}
            <motion.video
              key="tape1-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-20vw',
                right: prevPage === 'home' ? '-50vw' : prevPage === 'about' ? '-135vw' : 'auto',
                top: prevPage === 'home' ? '-5vw' : prevPage === 'about' ? '-15vw' : 'auto',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-30vw',
                rotate: prevPage === 'home' ? 58 : prevPage === 'about' ? 0 : 0,
                opacity: 1,
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: '-20vw',
                right: 'auto',
                top: 'auto',
                bottom: '-30vw',
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape2 to tape4 */}
            <motion.video
              key="tape2-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-40px',
                right: prevPage === 'home' ? '-10vw' : prevPage === 'about' ? '-140vw' : 'auto',
                top: prevPage === 'home' ? '-28vw' : prevPage === 'about' ? '-20vw' : 'auto',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-25vw',
                rotate: prevPage === 'home' ? 5 : prevPage === 'about' ? 0 : 25,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: '-40vw',
                right: 'auto',
                top: 'auto',
                bottom: '-25vw',
                rotate: 25,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape3 to tape1 */}
            <motion.video
              key="tape3-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-20vw' : prevPage === 'about' ? 'auto' : 'auto',
                right: prevPage === 'home' ? 'auto' : prevPage === 'about' ? '-130vw' : '-50vw',
                top: prevPage === 'home' ? 'auto' : prevPage === 'about' ? '-10vw' : '-5vw',
                bottom: prevPage === 'home' ? '-30vw' : prevPage === 'about' ? 'auto' : 'auto',
                rotate: prevPage === 'home' ? 0 : prevPage === 'about' ? 0 : 58,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-50vw',
                top: '-5vw',
                bottom: 'auto',
                rotate: 58,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape4 to tape2 */}
            <motion.video
              key="tape4-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-40vw' : prevPage === 'about' ? '-55vw' : 'auto',
                right: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-10vw',
                top: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-28vw',
                bottom: prevPage === 'home' ? '-25vw' : prevPage === 'about' ? '0vw' : 'auto',
                rotate: prevPage === 'home' ? 25 : prevPage === 'about' ? -90 : 5,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-10vw',
                top: '-28vw',
                bottom: 'auto',
                rotate: 5,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
          </AnimatePresence>
        </>
      )}
      {currentPage === 'work' && workTapeDone && (
        <>
          {/* 結束：新位置、正常大小、無模糊 */}
          <video
            ref={tapeVideo3Ref}
            {...videoProps}
            style={{...tapeStyles.tape3, rotate: '0deg'}}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo4Ref}
            {...videoProps}
            style={{...tapeStyles.tape4, rotate: '25deg'}}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo1Ref}
            {...videoProps}
            style={{...tapeStyles.tape1, rotate: '58deg'}}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo2Ref}
            {...videoProps}
            style={{...tapeStyles.tape2, rotate: '5deg'}}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
        </>
      )}



      {/* 進入about 的膠帶動畫 */}
      {currentPage === 'about' && workTapeStart && !workTapeDone && (
        <>
          <AnimatePresence>
            {/* tape1 to tape3 */}
            <motion.video
              key="tape1-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-20vw' : 'auto',
                right: prevPage === 'home' ? '-50vw' : prevPage === 'work' ? 'auto' : '-135vw',
                top: prevPage === 'home' ? '-5vw' : prevPage === 'work' ? 'auto' : '-15vw',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-30vw' : 'auto',
                rotate: prevPage === 'home' ? 58 : prevPage === 'work' ? 0 : 0,
                opacity: 1,
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-135vw',
                top: '-15vw',
                bottom: 'auto',
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape2 to tape4 */}
            <motion.video
              key="tape2-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-40vw' : 'auto',
                right: prevPage === 'home' ? '-10vw' : prevPage === 'work' ? 'auto' : '-140vw',
                top: prevPage === 'home' ? '-28vw' : prevPage === 'work' ? 'auto' : '-20vw',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-25vw' : 'auto',
                rotate: prevPage === 'home' ? 5 : prevPage === 'work' ? 25 : 0,
                opacity: 1                
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-140vw',
                top: '-20vw',
                bottom: 'auto',
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
                <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape3 to tape1 */}
            <motion.video
              key="tape3-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-20vw' : prevPage === 'work' ? 'auto' : 'auto',
                right: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-50vw' : '-130vw',
                top: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-5vw' : '-10vw',
                bottom: prevPage === 'home' ? '-30vw' : prevPage === 'work' ? 'auto' : 'auto',
                rotate: prevPage === 'home' ? 0 : prevPage === 'work' ? 58 : 0,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: 'auto',
                right: '-130vw',
                top: '-10vw',
                bottom: 'auto',
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
            {/* tape4 to tape2 */}
            <motion.video
              key="tape4-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-40vw' : prevPage === 'work' ? 'auto' : '-55vw',
                right: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-10vw' : 'auto',
                top: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-28vw' : 'auto',
                bottom: prevPage === 'home' ? '-25vw' : prevPage === 'work' ? 'auto' : '0vw',
                rotate: prevPage === 'home' ? 25 : prevPage === 'work' ? 5 : -90,
                opacity: 1
              }}
              animate={{
                scale: tapeScale,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: '-55vw',
                right: 'auto',
                top: 'auto',
                bottom: '0vw',
                rotate: -90,
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
            </motion.video>
          </AnimatePresence>
        </>
      )}
      {currentPage === 'about' && workTapeDone && (
        <>
          {/* 結束：新位置、正常大小、無模糊 */}
          <video
            ref={tapeVideo1Ref}
            {...videoProps}
            style={{...tapeStyles.tape1, rotate: '0deg'}}
            className="pointer-events-none select-none fixed right-[-135vw] top-[-15vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo2Ref}
            {...videoProps}
            style={{...tapeStyles.tape2, rotate: '0deg'}}
            className="pointer-events-none select-none fixed right-[-140vw] top-[-20vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo3Ref}
            {...videoProps}
            style={{...tapeStyles.tape3, rotate: '0deg'}}
            className="pointer-events-none select-none fixed right-[-130vw] top-[-10vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
          <video
            ref={tapeVideo4Ref}
            {...videoProps}
            style={{...tapeStyles.tape4, rotate: '-90deg'}}
            className="pointer-events-none select-none fixed left-[-55vw] bottom-[0vw] w-[120vw] max-w-none"
          >
              <source src={`${BASE_PATH}BG/Bar.webm`} type="video/webm" />
          </video>
        </>
      )}
     {/* 膠帶動畫結束 */}
     

      <div className="w-full h-full overflow-hidden">
        {/* Main content area */}
        <div className="w-full h-full">

          {/* Background */}
          <div className="fixed inset-0 w-full h-full z-0">
            {!videoError && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={currentPage === "work" ? true : !hasUserInteracted}
                playsInline
                preload="auto"
                key={currentPage} // 重要：強制重新加載不同頁面的視頻
                onError={handleVideoError}
                onLoadedData={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                  const video = e.target as HTMLVideoElement;
                  video.play().catch(() => {
                    // 靜默處理播放錯誤
                  });
                }}
              >
                {getBgVideoSrc(currentPage).map((source, idx) => (
                  <source 
                    key={`${currentPage}-${idx}`}
                    src={source.src} 
                    type={source.type} 
                    media={source.media}
                  />
                ))}
                您的瀏覽器不支援影片播放。
              </video>
            )}
          </div>

          {/* Content container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {currentPage === "intro" && (
              <div className="w-full h-full flex items-center justify-center">
                {/* Intro page content */}
              </div>
            )}

            {currentPage === "home" && (
              <div className="w-full h-full flex items-center justify-center">
                {/* Home page content would go here */}
              </div>
            )}

            {currentPage === "work" && (
              <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden p-6">
                <div className="max-w-7xl mx-auto w-full">
                  {/* Carousel Display */}
                  {filteredPortfolio.length > 0 && (
                    <div className="relative w-full max-w-6xl mx-auto mt-10">
                      {/* Main Carousel Container */}
                      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center px-4">
                        
                        {/* Left Preview (Previous Item) */}
                        <motion.div
                          key={`prev-${getPrevItem()?.id}`}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 0.6, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 md:left-8 w-48 md:w-56 h-64 md:h-72 cursor-pointer z-10 
                                     transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300"
                          onClick={prevSlide}
                        >
                          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden 
                                        border border-white/20 hover:border-white/50 shadow-lg hover:shadow-xl
                                        group relative">
                            <img
                              src={getPrevItem()?.thumbnail}
                              alt={getPrevItem()?.title}
                              className="w-full h-4/5 object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              style={{ filter: 'blur(5px)'}}
                            />
                            {/* Play button overlay for videos */}
                            {getPrevItem()?.video && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 rounded-full p-3">
                                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            )}
                            {/* Category Badge */}
                            <div className="absolute top-3 left-3">
                              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                {getPrevItem()?.category}
                              </span>
                            </div>
                            {/* Title */}
                            <div className="p-3 text-center">
                              <h3 className="text-sm font-abhaya font-extrabold text-white group-hover:text-yellow-300 
                                           transition-colors duration-300 truncate">
                                {getPrevItem()?.title}
                              </h3>
                            </div>
                          </div>
                        </motion.div>

                        {/* Center Display (Current Item) with Glass Mask */}
                        <motion.div
                          key={`current-${getCurrentItem()?.id}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="w-80 md:w-96 h-80 md:h-96 cursor-pointer z-20 relative"
                        >
                          
                          {/* Glass Display Container */}
                          <div className="w-full h-full relative">
                            {/* 毛玻璃層，z-10 */}
                            <motion.div
                              initial={false}
                              animate={{
                                opacity: isPlaying ? 0.2 : 1,
                                zIndex: 10
                              }}
                              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                              className="absolute inset-0 w-full h-full rounded-xl pointer-events-none backdrop-blur-[5px] backdrop-saturate-[1.2] bg-white/20 border border-white/30"
                              style={{
                                boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.3), inset 0 -20px 40px rgba(0,0,0,0.2)'
                              }}
                            />
                            {/* Inset Glass Frame（只保留陰影/邊框/反射） */}
                            <div className={`absolute inset-0 rounded-xl transition-all duration-700 pointer-events-none`}
                              style={{
                                boxShadow: isPlaying 
                                  ? 'none' 
                                  : 'inset 0 20px 40px rgba(0,0,0,0.3), inset 0 -20px 40px rgba(0,0,0,0.2)'
                              }}>
                            </div>
                            {/* 內容層，z-0（未播放）→ z-20（播放） */}
                            <motion.div
                              animate={{
                                scale: isPlaying ? 1.05 : 0.95,
                                y: isPlaying ? -15 : 8,
                                z: isPlaying ? 50 : -20,
                                rotateX: isPlaying ? 2 : -2,
                                rotateY: isPlaying ? -1 : 1,
                                zIndex: isPlaying ? 20 : 0
                              }}
                              transition={{ 
                                duration: isPlaying ? 0.8 : 1.2, 
                                ease: isPlaying 
                                  ? [0.25, 0.46, 0.45, 0.94]
                                  : [0.4, 0.0, 0.2, 1]
                              }}
                              className="absolute inset-4 rounded-lg overflow-hidden group"
                              style={{
                                transformStyle: 'preserve-3d'
                              }}
                            >
                              <div className="w-full h-full bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden 
                                            border border-white/30 shadow-xl relative">
                                <img
                                  src={getCurrentItem()?.thumbnail}
                                  alt={getCurrentItem()?.title}
                                  className="w-full h-4/5 object-cover group-hover:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                />                              

                              </div>
                            </motion.div>
                            {/* Play Button - Always visible, triggers the float effect */}
                            <div className="absolute inset-0 flex items-center justify-center z-30">
                              <motion.button
                                onClick={handlePlay}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                  opacity: isPlaying ? 0 : 1,
                                  scale: isPlaying ? 0.8 : 1
                                }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/90 hover:bg-white rounded-full p-4 shadow-2xl 
                                         backdrop-blur-sm border border-white/50 hover:border-white
                                         transition-all duration-300"
                              >
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </motion.button>
                            </div>
                            {/* Glass Reflection Effect */}
                            {!isPlaying && (
                              <div className="absolute inset-0 rounded-xl pointer-events-none">
                                <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
                                <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-lg"></div>
                              </div>
                            )}
                          </div>
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3 z-30">
                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                {getCurrentItem()?.category}
                                </span>
                                </div>                              
                                {/* Title */}
                                <div className="p-3 text-center z-30">
                                <h3 className="text-lg md:text-xl font-abhaya font-extrabold text-white group-hover:text-yellow-300 
                                transition-colors duration-300">
                                {getCurrentItem()?.title}
                                </h3>
                                </div>
                        </motion.div>

                        {/* Right Preview (Next Item) */}
                        <motion.div
                          key={`next-${getNextItem()?.id}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 0.6, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute right-0 md:right-8 w-48 md:w-56 h-64 md:h-72 cursor-pointer z-10 
                                     transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300"
                          onClick={nextSlide}
                        >
                          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden 
                                        border border-white/20 hover:border-white/50 shadow-lg hover:shadow-xl
                                        group relative">
                            <img
                              src={getNextItem()?.thumbnail}
                              alt={getNextItem()?.title}
                              className="w-full h-4/5 object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              style={{ filter: 'blur(5px)'}}
                            />
                            {/* Play button overlay for videos */}
                            {getNextItem()?.video && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 rounded-full p-3">
                                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            )}
                            {/* Category Badge */}
                            <div className="absolute top-3 left-3">
                              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                {getNextItem()?.category}
                              </span>
                            </div>
                            {/* Title */}
                            <div className="p-3 text-center">
                              <h3 className="text-sm font-abhaya font-extrabold text-white group-hover:text-yellow-300 
                                           transition-colors duration-300 truncate">
                                {getNextItem()?.title}
                              </h3>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Navigation Dots */}
                      <div className="flex justify-center mt-8 space-x-2">
                        {filteredPortfolio.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-1 rounded-full transition-all duration-300 ${
                              currentIndex === index
                                ? "bg-white scale-125 shadow-lg"
                                : "bg-white/30 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 
                                 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center
                                 transition-all duration-300 backdrop-blur-sm border border-white/20 z-30
                                 hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 
                                 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center
                                 transition-all duration-300 backdrop-blur-sm border border-white/20 z-30
                                 hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8 mt-4">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-2 py-1 rounded-full text-sm font-abhaya font-extrabold transition-all duration-300 border-2
                          ${selectedCategory === category
                            ? "bg-white text-black border-white shadow-lg scale-105"
                            : "bg-transparent text-white border-white/50 hover:border-white hover:bg-white/10"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal for detailed view */}
                <AnimatePresence>
                  {isModalOpen && selectedWorkItem && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={handleModalClose}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white/10 backdrop-blur-lg rounded-lg max-w-4xl max-h-[90vh] 
                                   overflow-auto border border-white/20"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/20">
                          <div>
                            <h2 className="text-2xl font-bold text-white">{selectedWorkItem.title}</h2>
                            <p className="text-white/70">{selectedWorkItem.category}</p>
                          </div>
                          <button
                            onClick={handleModalClose}
                            className="text-white hover:text-red-400 transition-colors p-2"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                          {selectedWorkItem.video ? (
                            <div className="aspect-video mb-4">
                              <video
                                className="w-full h-full rounded-lg"
                                controls
                                preload="metadata"
                                poster={selectedWorkItem.thumbnail}
                                onLoadStart={() => console.log('Video loading started')}
                              >
                                <source src={selectedWorkItem.video} type="video/mp4" />
                                您的瀏覽器不支援視頻播放。
                              </video>
                            </div>
                          ) : (
                            <div className="aspect-video mb-4">
                              <img
                                src={selectedWorkItem.thumbnail}
                                alt={selectedWorkItem.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}

                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {currentPage === "about" && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-[732px] h-[665px] flex flex-col relative">
                  <div className="
                  absolute w-[314px] h-[159px] top-28 font-abhaya font-extrabold
                   text-white text-[15px] tracking-[-0.40px] leading-10 text-justify
                    rounded-md flex flex-col items-center justify-center">
                    {aboutContent.bio}
                  </div>
                  <div className="absolute w-[314px] h-[159px] top-[400px] ">
                    <div className="absolute w-[314px] top-0 left-0 font-abhaya font-extrabold">
                      <span className="text-white tracking-[-0.20px] text-[32px] leading-[96px]">
                        Contact : <br />
                      </span>
                      <span className="text-white text-xl tracking-[0] leading-[0.1px]">
                        Email : <a href={`mailto:${aboutContent.contact.email}`} className="hover:underline font-abhaya">{aboutContent.contact.email}</a>
                      </span>
                    </div>
                    <div className="absolute flex gap-2 bottom-0 left-0">
                      {aboutContent.contact.social.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            className="w-[25px] h-[25px]"
                            alt={item.id}
                            src={item.imgSrc}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation bar */}
            <motion.div
              className="fixed right-[90px] bottom-[100px] z-10 flex items-center h-12 px-4 shadow-none"
              initial={{ opacity: 0, display: 'none' }}
              animate={{
                opacity: currentPage === "intro" ? 0 : 1,
                display: currentPage === "intro" ? 'none' : 'block',
                transition: { duration: 2 }
              }}
            >
              {/* 漢堡選單按鈕 - 在 md 以下顯示 */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  className="absolute bottom-[-50px] right-[-70px] h-[60px] w-[60px] rounded-full bg-white/0 hover:bg-white/30"
                  onMouseEnter={() => setIsMenuOpen(true)}
                  onMouseLeave={() => setIsMenuOpen(false)}

                >
                  <Menu 
                  className="h-8 w-8 text-white scale-150"
                  />
                </Button>
                
                {/* 漢堡選單內容 */}
                <motion.div
                  className="absolute bottom-[-50px] right-[-80px] rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0,
                    y: isMenuOpen ? 0 : 5,
                    display: isMenuOpen ? 'block' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-0">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={`h-[40px] w-[180px] rounded-md flex flex-col items-center justify-end pb-2 border-none shadow-none bg-transparent
                                    ${activeTab === item.id
                                      ? "bg-[url('/ButtonImage/Buttom.png')] bg-no-repeat bg-center bg-contain"
                                      : ""
                                    }`}
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                        onClick={() => {
                          handlePageChange(item.id);
                          setIsMenuOpen(false);
                        }}
                      >
                        <img
                          className="h-20 w-20 object-contain object-center scale-[2]"
                          alt={item.label}
                          src={item.imgSrc}
                        />
                      </Button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* 一般導航列 - 在 md 以上顯示 */}
              <div className="hidden md:flex">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`h-[40px] w-[170px] rounded-md flex flex-col items-center justify-end pb-2 border-none shadow-none bg-transparent
                                ${activeTab === item.id
                                  ? "bg-[url('/ButtonImage/Buttom.png')] bg-center bg-contain"
                                  : ""
                                }`}
                    onClick={() => handlePageChange(item.id)}
                  >
                    <img
                      className="h-20 w-20 object-contain object-center scale-[2]"
                      alt={item.label}
                      src={item.imgSrc}
                    />
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
