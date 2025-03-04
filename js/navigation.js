/**
 * navigation.js - 네비게이션 및 섹션 전환 관련 기능
 */

/**
 * 네비게이션 인디케이터 업데이트 함수
 * @param {HTMLElement} prevElement - 이전 활성 링크
 * @param {HTMLElement} nextElement - 새 활성 링크
 */
function updateNavIndicator(prevElement, nextElement) {
  const navIndicator = document.querySelector('.nav-indicator');
  
  if (!navIndicator || !prevElement || !nextElement) return;
  
  // 위치 및 크기 계산
  const prevRect = prevElement.getBoundingClientRect();
  const nextRect = nextElement.getBoundingClientRect();
  const navLinksRect = document.querySelector('.nav-links').getBoundingClientRect();
  
  // 이전 및 새 위치 계산 (상대적 위치)
  const prevLeft = prevRect.left - navLinksRect.left;
  const prevWidth = prevRect.width;
  const nextLeft = nextRect.left - navLinksRect.left;
  const nextWidth = nextRect.width;
  
  // CSS 변수로 시작점과 끝점 설정
  document.documentElement.style.setProperty('--nav-start', `${prevLeft}px`);
  document.documentElement.style.setProperty('--nav-start-width', `${prevWidth}px`);
  document.documentElement.style.setProperty('--nav-end', `${nextLeft}px`);
  document.documentElement.style.setProperty('--nav-end-width', `${nextWidth}px`);
  
  // 애니메이션 적용 전 초기 설정
  navIndicator.style.left = `${prevLeft}px`;
  navIndicator.style.width = `${prevWidth}px`;
  
  // 애니메이션 진행
  navIndicator.classList.add('moving');
  
  // 애니메이션 종료 후 클래스 제거
  setTimeout(() => {
    navIndicator.classList.remove('moving');
    navIndicator.style.left = `${nextLeft}px`;
    navIndicator.style.width = `${nextWidth}px`;
  }, 400); // 애니메이션 시간과 동일하게 설정
}

/**
 * 네비게이션 초기화 함수
 */
function initializeNavigation() {
  // 네비게이션 링크 선택 및 이벤트 설정
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      changeSection(targetId);
    });
  });

  // 초기 인디케이터 위치 설정
  const activeLink = document.querySelector('.nav-links a.active');
  if (activeLink) {
    const navIndicator = document.querySelector('.nav-indicator');
    const navLinksRect = document.querySelector('.nav-links').getBoundingClientRect();
    const activeLinkRect = activeLink.getBoundingClientRect();
    
    const activeLeft = activeLinkRect.left - navLinksRect.left;
    const activeWidth = activeLinkRect.width;
    
    if (navIndicator) {
      navIndicator.style.left = `${activeLeft}px`;
      navIndicator.style.width = `${activeWidth}px`;
    }
  }
  
  // 스크롤 인디케이터 클릭 이벤트 설정
  document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
    dot.addEventListener('click', function() {
      changeSection(window.sections[index].id);
    });
  });
  
  // 홈 화면 스크롤 인디케이터 클릭 이벤트
  const homeScrollIndicator = document.querySelector('.home-scroll-indicator');
  if (homeScrollIndicator) {
    homeScrollIndicator.addEventListener('click', function() {
      changeSection('portfolio');
    });
  }
  
  // 스크롤 위치에 따른 인디케이터 표시/숨김
  window.addEventListener('scroll', function() {
    const homeScrollIndicator = document.querySelector('.home-scroll-indicator');
    if (homeScrollIndicator) {
      if (window.scrollY > 100) {
        homeScrollIndicator.classList.add('hide');
      } else {
        homeScrollIndicator.classList.remove('hide');
      }
    }
  });
  
  // 키보드 방향키로 섹션 이동
  document.addEventListener('keydown', function(e) {
    const currentIndex = window.sections.findIndex(section => section.id === window.currentSectionId);
    
    if (e.key === 'ArrowDown' && currentIndex < window.sections.length - 1) {
      changeSection(window.sections[currentIndex + 1].id);
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      changeSection(window.sections[currentIndex - 1].id);
    }
  });
  
  // 마우스 휠 이벤트
  setupWheelNavigation();
  
  // 터치 이벤트 (모바일용)
  setupTouchNavigation();
  
  // 창 크기 변경 시 인디케이터 위치 업데이트
  window.addEventListener('resize', function() {
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
      const navIndicator = document.querySelector('.nav-indicator');
      const navLinksRect = document.querySelector('.nav-links').getBoundingClientRect();
      const activeLinkRect = activeLink.getBoundingClientRect();
      
      const activeLeft = activeLinkRect.left - navLinksRect.left;
      const activeWidth = activeLinkRect.width;
      
      if (navIndicator) {
        navIndicator.style.left = `${activeLeft}px`;
        navIndicator.style.width = `${activeWidth}px`;
        navIndicator.style.transition = 'none'; // 리사이즈 시 애니메이션 비활성화
        
        // 트랜지션 복원
        setTimeout(() => {
          navIndicator.style.transition = '';
        }, 50);
      }
    }
  });
}

/**
 * 섹션 변경 함수
 * @param {string} targetId - 대상 섹션 ID
 */
function changeSection(targetId) {
  const currentIndex = window.sections.findIndex(section => section.id === window.currentSectionId);
  const targetIndex = window.sections.findIndex(section => section.id === targetId);
  const goingDown = targetIndex > currentIndex; // 아래로 이동 여부 확인
  
  // 모든 영상과 오디오 정지
  stopAllMedia();
  
  // 네비게이션 링크 상태 업데이트 및 애니메이션
  const previousActive = document.querySelector('.nav-links a.active');
  const newActive = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
  
  if (previousActive && newActive && previousActive !== newActive) {
    updateNavIndicator(previousActive, newActive);
  }
  
  // 현재 섹션 페이드아웃
  const currentElement = document.getElementById(window.currentSectionId);
  currentElement.classList.add('exiting');
  
  setTimeout(() => {
    // 현재 섹션 ID 업데이트
    window.currentSectionId = targetId;
    
    // 모든 섹션 상태 초기화
    window.sections.forEach(section => {
      section.element.classList.remove('active', 'entering', 'exiting');
    });
    
    // 타겟 섹션 진입 애니메이션 시작
    const targetElement = document.getElementById(targetId);
    targetElement.classList.add('entering');
    
    // 타겟 섹션이 DOM에 보이도록 스크롤
    targetElement.scrollIntoView({ behavior: 'instant' });
    
    setTimeout(() => {
      // 진입 애니메이션 완료 후 액티브 상태로 변경
      targetElement.classList.remove('entering');
      targetElement.classList.add('active');
      
      // 스크롤 위치 조정
      setTimeout(() => {
        if (goingDown) {
          // 아래로 이동 시, 새 섹션의 맨 위로 스크롤
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'instant'
          });
        } else {
          // 위로 이동 시, 이전 섹션의 맨 아래로 스크롤
          window.scrollTo({
            top: targetElement.offsetTop + targetElement.offsetHeight - window.innerHeight,
            behavior: 'instant'
          });
        }
        
        // 스크롤 인디케이터 업데이트
        updateScrollIndicator();
      }, 50);
    }, 100);
    
    // 네비게이션 링크 상태 업데이트
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      }
    });
  }, 300);
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
 * 휠 네비게이션 설정
 * 스크롤을 통한 섹션 변경 기능이 비활성화됨
 */
function setupWheelNavigation() {
  // 휠 이벤트를 통한 섹션 자동 변환 비활성화
  // 원래 코드는 주석 처리
  /*
  let wheelTimeout;
  let lastWheelTime = 0;
  const wheelDelay = 500; 
  const wheelThreshold = 20;
  let wheelDeltaSum = 0;
  
  document.addEventListener('wheel', function(e) {
    const currentTime = new Date().getTime();
    const currentSection = document.getElementById(window.currentSectionId);
    
    const sectionTop = currentSection.offsetTop;
    const sectionHeight = currentSection.offsetHeight;
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    const isScrolledToEnd = (scrollPosition + viewportHeight) >= (sectionTop + sectionHeight - 20);
    const isAtTop = scrollPosition <= sectionTop + 20;
    
    wheelDeltaSum += e.deltaY;
    
    if (currentTime - lastWheelTime > wheelDelay) {
      clearTimeout(wheelTimeout);
      
      wheelTimeout = setTimeout(() => {
        const currentIndex = window.sections.findIndex(section => section.id === window.currentSectionId);
        
        if (Math.abs(wheelDeltaSum) > wheelThreshold) {
          if (wheelDeltaSum > 0 && currentIndex < window.sections.length - 1 && isScrolledToEnd) {
            e.preventDefault();
            changeSection(window.sections[currentIndex + 1].id);
          } else if (wheelDeltaSum < 0 && currentIndex > 0 && isAtTop) {
            e.preventDefault();
            changeSection(window.sections[currentIndex - 1].id);
          }
          
          wheelDeltaSum = 0;
          lastWheelTime = currentTime;
        }
      }, 100);
    }
  }, { passive: false });
  */
  
  // 일반 스크롤 동작만 유지
  console.log("휠 네비게이션이 비활성화되었습니다. 일반 스크롤만 동작합니다.");
}

/**
 * 터치 네비게이션 설정 (모바일용)
 * 터치 스와이프를 통한 섹션 변경 기능이 비활성화됨
 */
function setupTouchNavigation() {
  // 터치 스와이프를 통한 섹션 자동 변환 기능 비활성화
  // 원래 코드는 주석 처리
  /*
  let touchStartY = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const difference = touchStartY - touchEndY;
    const threshold = 100;
    
    const currentIndex = window.sections.findIndex(section => section.id === window.currentSectionId);
    
    if (difference > threshold && currentIndex < window.sections.length - 1) {
      changeSection(window.sections[currentIndex + 1].id);
    } else if (difference < -threshold && currentIndex > 0) {
      changeSection(window.sections[currentIndex - 1].id);
    }
  }
  */
  
  // 일반 터치 스크롤 동작만 유지
  console.log("터치 네비게이션이 비활성화되었습니다. 일반 터치 스크롤만 동작합니다.");
}