import { Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Define navigation items for reuse
const navigationItems = [
  {
    id: "about",
    label: "About",
    imgSrc: "public/ButtonImage/About.png",
  },
  {
    id: "work",
    label: "Work",
    imgSrc: "public/ButtonImage/WORK.png",
  },
  {
    id: "home",
    label: "Home",
    imgSrc: "public/ButtonImage/HOME.png",
  },
];

// About page content
const aboutContent = {
  bio: <p>To Ukraine, it's 365 days — to Taiwan, only 8,760 hours pass.<br />Wait, no — where is Taiwan.<br />Oh? You mean China, right?<br />Because Taiwan doesn't exist — or so you'd say：）<br />I Love Taiwan.</p>,
  contact: {
    email: "trenton5412@gmail.com",
    social: [
      { id: "ig", imgSrc: "public/ButtonImage/IG.png", type: "image", url: "https://www.instagram.com/off_trent_on" },
      { id: "yt", imgSrc: "public/ButtonImage/YT.png", type: "image", url: "https://www.youtube.com/@lllolll_TrenT%C3%B6n" },
    ],
  },
};

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

// 定義共用的樣式
const tapeStyles = {
  tape1: { transform: 'rotate(58deg) scale(1.5)', zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' },
  tape2: { transform: 'rotate(5deg) scale(1.5)', zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' },
  tape3: { transform: 'rotate(0deg) scale(1.5)', zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' },
  tape4: { transform: 'rotate(25deg) scale(1.5)', zIndex: 30, filter: 'drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))' }
};

export const Box = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentPage, setCurrentPage] = useState("intro");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [workTapeDone, setWorkTapeDone] = useState(false);
  const [workTapeStart, setWorkTapeStart] = useState(false);
  const [prevPage, setPrevPage] = useState("intro");
  const lavaRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const uiSoundRef = useRef<HTMLAudioElement | null>(null);
  const tapeVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  {/* 前景膠帶特效 */}
  useEffect(() => {
    if (currentPage === "intro") {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentPage("home");
          setIsTransitioning(false);
        }, 300);
      }, 2980);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'home' || currentPage === 'work' || currentPage === 'about') {
      setWorkTapeDone(false);
      setWorkTapeStart(false);
      setTimeout(() => setWorkTapeStart(true), 100);
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

  // 修改影片控制邏輯
  useEffect(() => {
    if (tapeVideoRef.current) {
      // 不要重設 currentTime，讓影片保持原本的播放進度
      tapeVideoRef.current.play();
    }
  }, [currentPage]);
  
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
        src="public/SoundEffect/BGM01.mp3"
        loop
        preload="auto"
        className="hidden"
        muted={currentPage === "work"}
      />
      {/* UI 音效 */}
      <audio
        ref={uiSoundRef}
        src="public/SoundEffect/ui-sound-on-270295.mp3"
        preload="auto"
        className="hidden"
      />
      {/* Intro Page 的前景膠帶佈局 */}
      {currentPage === 'intro' && (
        <>
          {/* 右上角兩條 */}
          <video
            ref={tapeVideoRef}
            {...videoProps}
            style={tapeStyles.tape1}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape2}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          {/* 左下角兩條 */}
          <video
            {...videoProps}
            style={tapeStyles.tape3}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape4}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
        </>
      )}
      {/*  Home Page 的前景膠帶佈局 */}
      {currentPage === 'home' && !workTapeStart && (
        <>
          {/* 右上角兩條 */}
          <video
            {...videoProps}
            style={tapeStyles.tape1}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape2}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          {/* 左下角兩條 */}
          <video
            {...videoProps}
            style={tapeStyles.tape3}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape4}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
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
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? '-20vw' : prevPage === 'about' ? 'auto' : 'auto',
                right: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-135vw' : '-50vw',
                top: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-15vw' : '-5vw',
                bottom: prevPage === 'work' ? '-30vw' : prevPage === 'about' ? 'auto' : 'auto',
                rotate: prevPage === 'work' ? 0 : prevPage === 'about' ? 0 : 58,
                opacity: 1,
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape2 to tape4 */}
            <motion.video
              key="tape2-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? '-40vw' : prevPage === 'about' ? 'auto' : 'auto',
                right: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-140vw' : '-10vw',
                top: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-20vw' : '-28vw',
                bottom: prevPage === 'work' ? '-25vw' : prevPage === 'about' ? 'auto' : 'auto',
                rotate: prevPage === 'work' ? 25 : prevPage === 'about' ? 0 : 5,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape3 to tape1 */}
            <motion.video
              key="tape3-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? 'auto' : prevPage === 'about' ? 'auto' : '-20vw',
                right: prevPage === 'work' ? '-50vw' : prevPage === 'about' ? '-130vw' : 'auto',
                top: prevPage === 'work' ? '-5vw' : prevPage === 'about' ? '-10vw' : 'auto',
                bottom: prevPage === 'work' ? 'auto' : prevPage === 'about' ? 'auto' : '-30vw',
                rotate: prevPage === 'work' ? 58 : prevPage === 'about' ? 0 : 0,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape4 to tape2 */}
            <motion.video
              key="tape4-home"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '-55vw' : '-40vw',
                right: prevPage === 'work' ? '-10vw' : prevPage === 'about' ? 'auto' : 'auto',
                top: prevPage === 'work' ? '-28vw' : prevPage === 'about' ? 'auto' : 'auto',
                bottom: prevPage === 'work' ? 'auto' : prevPage === 'about' ? '0vw' : '-25vw',
                rotate: prevPage === 'work' ? 5 : prevPage === 'about' ? -90 : 25,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
          </AnimatePresence>
        </>
      )}
      {currentPage === 'home' && workTapeDone && (
        <>
          {/* 結束：新位置、正常大小、無模糊 */}
          <video
            {...videoProps}
            style={tapeStyles.tape1}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape2}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape3}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape4}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
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
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-20vw',
                right: prevPage === 'home' ? '-50vw' : prevPage === 'about' ? '-135vw' : 'auto',
                top: prevPage === 'home' ? '-5vw' : prevPage === 'about' ? '-15vw' : 'auto',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-30vw',
                rotate: prevPage === 'home' ? 58 : prevPage === 'about' ? 0 : 0,
                opacity: 1,
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape2 to tape4 */}
            <motion.video
              key="tape2-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-40px',
                right: prevPage === 'home' ? '-10vw' : prevPage === 'about' ? '-140vw' : 'auto',
                top: prevPage === 'home' ? '-28vw' : prevPage === 'about' ? '-20vw' : 'auto',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-25vw',
                rotate: prevPage === 'home' ? 5 : prevPage === 'about' ? 0 : 25,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape3 to tape1 */}
            <motion.video
              key="tape3-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-20vw' : prevPage === 'about' ? 'auto' : 'auto',
                right: prevPage === 'home' ? 'auto' : prevPage === 'about' ? '-130vw' : '-50vw',
                top: prevPage === 'home' ? 'auto' : prevPage === 'about' ? '-10vw' : '-5vw',
                bottom: prevPage === 'home' ? '-30vw' : prevPage === 'about' ? 'auto' : 'auto',
                rotate: prevPage === 'home' ? 0 : prevPage === 'about' ? 0 : 58,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape4 to tape2 */}
            <motion.video
              key="tape4-work"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-40vw' : prevPage === 'about' ? '-55vw' : 'auto',
                right: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-10vw',
                top: prevPage === 'home' ? 'auto' : prevPage === 'about' ? 'auto' : '-28vw',
                bottom: prevPage === 'home' ? '-25vw' : prevPage === 'about' ? '0vw' : 'auto',
                rotate: prevPage === 'home' ? 25 : prevPage === 'about' ? -90 : 5,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
          </AnimatePresence>
        </>
      )}
      {currentPage === 'work' && workTapeDone && (
        <>
          {/* 結束：新位置、正常大小、無模糊 */}
          <video
            {...videoProps}
            style={tapeStyles.tape3}
            className="pointer-events-none select-none fixed left-[-20vw] bottom-[-30vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape4}
            className="pointer-events-none select-none fixed left-[-40vw] bottom-[-25vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape1}
            className="pointer-events-none select-none fixed right-[-50vw] top-[-5vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape2}
            className="pointer-events-none select-none fixed right-[-10vw] top-[-28vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
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
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-20vw' : 'auto',
                right: prevPage === 'home' ? '-50vw' : prevPage === 'work' ? 'auto' : '-135vw',
                top: prevPage === 'home' ? '-5vw' : prevPage === 'work' ? 'auto' : '-15vw',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-30vw' : 'auto',
                rotate: prevPage === 'home' ? 58 : prevPage === 'work' ? 0 : 0,
                opacity: 1,
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape2 to tape4 */}
            <motion.video
              key="tape2-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-40vw' : 'auto',
                right: prevPage === 'home' ? '-10vw' : prevPage === 'work' ? 'auto' : '-140vw',
                top: prevPage === 'home' ? '-28vw' : prevPage === 'work' ? 'auto' : '-20vw',
                bottom: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-25vw' : 'auto',
                rotate: prevPage === 'home' ? 5 : prevPage === 'work' ? 25 : 0,
                opacity: 1                
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape3 to tape1 */}
            <motion.video
              key="tape3-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-20vw' : prevPage === 'work' ? 'auto' : 'auto',
                right: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-50vw' : '-130vw',
                top: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-5vw' : '-10vw',
                bottom: prevPage === 'home' ? '-30vw' : prevPage === 'work' ? 'auto' : 'auto',
                rotate: prevPage === 'home' ? 0 : prevPage === 'work' ? 58 : 0,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
            {/* tape4 to tape2 */}
            <motion.video
              key="tape4-about"
              {...videoProps}
              style={{ zIndex: 40, position: 'fixed' }}
              initial={{
                scale: 1.5,
                filter: 'blur(0px) drop-shadow(8px 8px 8px rgba(0, 0, 0, 0.7))',
                left: prevPage === 'home' ? '-40vw' : prevPage === 'work' ? 'auto' : '-55vw',
                right: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-10vw' : 'auto',
                top: prevPage === 'home' ? 'auto' : prevPage === 'work' ? '-28vw' : 'auto',
                bottom: prevPage === 'home' ? '-25vw' : prevPage === 'work' ? 'auto' : '0vw',
                rotate: prevPage === 'home' ? 25 : prevPage === 'work' ? 5 : -90,
                opacity: 1
              }}
              animate={{
                scale: 1.5,
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
              <source src="public/BG/Bar.webm" type="video/webm" />
            </motion.video>
          </AnimatePresence>
        </>
      )}
      {currentPage === 'about' && workTapeDone && (
        <>
          {/* 結束：新位置、正常大小、無模糊 */}
          <video
            {...videoProps}
            style={tapeStyles.tape1}
            className="pointer-events-none select-none fixed right-[-135vw] top-[-15vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape2}
            className="pointer-events-none select-none fixed right-[-140vw] top-[-20vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape3}
            className="pointer-events-none select-none fixed right-[-130vw] top-[-10vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
          <video
            {...videoProps}
            style={tapeStyles.tape4}
            className="pointer-events-none select-none fixed left-[-55vw] bottom-[0vw] w-[120vw] max-w-none"
          >
            <source src="public/BG/Bar.webm" type="video/webm" />
          </video>
        </>
      )}
     {/* 膠帶動畫結束 */}
     

      <div className="w-full h-full overflow-hidden">
        {/* Main content area */}
        <div className="relative w-full h-full">

          {/* Background */}
          <div className="absolute inset-0 w-full h-full">

         {/* Background 影片 */}
            {currentPage === "intro" && (
              <video
                className={`w-full h-full object-cover duration-300 ${isTransitioning ? "opacity-100" : "opacity-100"}`}
                autoPlay
                muted={!hasUserInteracted}
                playsInline
              >
                <source src="public/BG/1280-1080_intro.webm" type="video/mp4" media="(min-width: 1024px)" />
                <source src="public/BG/800-1080_intro.webm" type="video/mp4" media="(min-width: 768px) and (max-width: 1023px)" />
                <source src="public/BG/375-1080_intro.webm" type="video/mp4" media="(max-width: 767px)" />
              </video>
            )}
            {currentPage === "home" && (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted={!hasUserInteracted}
                loop
                playsInline
              >
                <source src="public/BG/1280-1080Main_sound.webm" type="video/mp4" media="(min-width: 1024px)" />
                <source src="public/BG/800-1080Main_sound.webm" type="video/mp4" media="(min-width: 768px) and (max-width: 1023px)" />
                <source src="public/BG/375-1080Main_sound.webm" type="video/mp4" media="(max-width: 767px)" />
              </video>
            )}
            {currentPage === "work" && (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="public/BG/1280-1080Clean.webm" type="video/mp4" media="(min-width: 1024px)" />
                <source src="public/BG/800-1080Clean.webm" type="video/mp4" media="(min-width: 768px) and (max-width: 1023px)" />
                <source src="public/BG/375-1080Clean.webm" type="video/mp4" media="(max-width: 767px)" />
              </video>
            )}
            {currentPage === "about" && (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted={!hasUserInteracted}
                loop
                playsInline
              >
                <source src="public/BG/1280-1080Clean_sound.webm" type="video/mp4" media="(min-width: 1024px)" />
                <source src="public/BG/800-1080Clean_sound.webm" type="video/mp4" media="(min-width: 768px) and (max-width: 1023px)" />
                <source src="public/BG/375-1080Clean_sound.webm" type="video/mp4" media="(max-width: 767px)" />
              </video>
            )}
            
            {/* canvas 僅用於產生 mask，不顯示 */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* 熔岩影片（下層） */}
            <video
              ref={lavaRef}
              src="public/BG/lava.mp4"
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
              style={{
                opacity: 0,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
              }}
            />
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
              <div className="w-full h-full flex items-center justify-center">


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
                        Email : <a href={`mailto:${aboutContent.contact.email}`} className="hover:underline">{aboutContent.contact.email}</a>
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
              className="fixed bottom-[90px] left-1/2 -translate-x-[-50px] z-1 shadow-none"
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
                  className="absolute bottom-[-50px] right-[10px] h-[60px] w-[60px] rounded-full bg-white/0 hover:bg-white/30"
                  onMouseEnter={() => setIsMenuOpen(true)}
                  onMouseLeave={() => setIsMenuOpen(false)}

                >
                  <Menu 
                  className="h-8 w-8 text-white scale-150"
                  />
                </Button>
                
                {/* 漢堡選單內容 */}
                <motion.div
                  className="absolute bottom-[-50px] right-[8px] rounded-lg p-4"
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
                                      ? "bg-[url('public/ButtonImage/Buttom.png')] bg-no-repeat bg-center bg-contain"
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
                                  ? "bg-[url('public/ButtonImage/Buttom.png')] bg-center bg-contain"
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
