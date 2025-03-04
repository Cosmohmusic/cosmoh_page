/**
 * app.js - 애플리케이션 초기화 및 이벤트 리스너 설정
 */

document.addEventListener('DOMContentLoaded', function() {
  // EmailJS 초기화
  (function() {
    emailjs.init("eEo4Dtv1mgtB5g48Y");
  })();
  
  // 기본 기능 설정 - 우클릭 및 드래그 방지
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });
  
  // 현재 활성화된 섹션 ID 저장 변수
  window.currentSectionId = 'home';
  
  // 섹션 선택
  window.sections = [
    { id: 'home', element: document.getElementById('home') },
    { id: 'portfolio', element: document.getElementById('portfolio') },
    { id: 'about', element: document.getElementById('about') },
    { id: 'contact', element: document.getElementById('contact') }
  ];
  
  // 각 모듈 초기화
  initializeLanguage();
  initializeNavigation();
  initializeForm();
  
  // 포트폴리오 버튼 이벤트 리스너 추가
  const portfolioBtn = document.getElementById('viewPortfolioBtn');
  if (portfolioBtn) {
    portfolioBtn.addEventListener('click', function(e) {
      e.preventDefault();
      changeSection('portfolio');
    });
  }
  
  // 팝업 닫기 버튼 이벤트
  const popupClose = document.getElementById('popupClose');
  const popupOverlay = document.getElementById('popupOverlay');
  
  if (popupClose && popupOverlay) {
    popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);
  }
  
  // 초기 인디케이터 상태 설정
  updateScrollIndicator();
  
  // 섹션 변경 시 미디어 정지
  window.addEventListener('hashchange', function() {
    stopAllMedia();
  });
  
  // 스크롤 이벤트에 미디어 정지 함수 연결
  let lastScrollTop = 0;
  let scrollThreshold = 150; // 스크롤 임계값
  
  window.addEventListener('scroll', function() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 스크롤이 임계값 이상 변경되었을 때만 체크
    if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
      const currentSection = getCurrentSectionFromScroll();
      
      // 현재 스크롤 위치가 다른 섹션으로 이동했다면 미디어 정지
      if (currentSection && currentSection !== window.currentSectionId) {
        stopAllMedia();
      }
      
      lastScrollTop = currentScrollTop;
    }
  });
});

/**
 * 현재 스크롤 위치에 따른 섹션 ID 반환
 * @returns {string} 현재 보이는 섹션 ID
 */
function getCurrentSectionFromScroll() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  let currentSection = '';
  
  window.sections.forEach(section => {
    const element = section.element;
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const offsetTop = rect.top + scrollPosition;
    const offsetBottom = offsetTop + rect.height;
    
    if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetBottom) {
      currentSection = section.id;
    }
  });
  
  return currentSection;
}

/**
 * 모든 미디어(유튜브 영상, 오디오) 정지 함수
 */
function stopAllMedia() {
  // 유튜브 영상 정지
  const videoIds = ['youtubeVideo1', 'youtubeVideo2', 'youtubeVideo3', 'youtubeVideo4'];
  
  videoIds.forEach(id => {
    const iframe = document.getElementById(id);
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = currentSrc;
    }
  });
  
  // 오디오 플레이어 정지
  const audioPlayers = document.querySelectorAll('audio');
  audioPlayers.forEach(player => {
    player.pause();
    player.currentTime = 0;
  });
}

/**
 * 팝업 표시 함수
 */
function showPopup() {
  const messagePopup = document.getElementById('messagePopup');
  const popupOverlay = document.getElementById('popupOverlay');
  
  messagePopup.style.display = 'block';
  popupOverlay.style.display = 'block';
}

/**
 * 팝업 닫기 함수
 */
function closePopup() {
  const messagePopup = document.getElementById('messagePopup');
  const popupOverlay = document.getElementById('popupOverlay');
  
  messagePopup.style.display = 'none';
  popupOverlay.style.display = 'none';
}

/**
 * 스크롤 인디케이터 업데이트 함수
 */
function updateScrollIndicator() {
  const currentIndex = window.sections.findIndex(section => section.id === window.currentSectionId);
  const dots = document.querySelectorAll('.scroll-dot');
  
  dots.forEach((dot, i) => {
    if (i === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}