/**
 * language.js - 다국어 지원 기능
 */

/**
 * 언어 모듈 초기화 함수
 */
function initializeLanguage() {
  // 언어 선택 엘리먼트
  const languageSelect = document.getElementById('languageSelect');
  const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
  const currentFlag = document.getElementById('currentFlag');
  const mobileFlagIcon = document.getElementById('mobileFlagIcon');
  
  // 브라우저 언어 감지하여 초기 언어 설정
  let currentLanguage = 'ko';
  
  // 초기 언어 설정 적용
  document.body.className = 'lang-' + currentLanguage;
  
  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }
  
  if (mobileLanguageSelect) {
    mobileLanguageSelect.value = currentLanguage;
  }
  
  updateLanguage();
  updateFlag(currentLanguage);
  
  // 데스크톱 언어 선택 이벤트 리스너
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      currentLanguage = this.value;
      document.body.className = 'lang-' + currentLanguage;
      
      // 모바일 선택기도 동기화
      if (mobileLanguageSelect) {
        mobileLanguageSelect.value = currentLanguage;
      }
      
      updateLanguage();
      updateFlag(currentLanguage);
    });
  }
  
  // 모바일 언어 선택 이벤트 리스너 추가
  if (mobileLanguageSelect) {
    mobileLanguageSelect.addEventListener('change', function() {
      currentLanguage = this.value;
      document.body.className = 'lang-' + currentLanguage;
      
      // 데스크톱 선택기도 동기화
      if (languageSelect) {
        languageSelect.value = currentLanguage;
      }
      
      updateLanguage();
      updateFlag(currentLanguage);
    });
  }
}

/**
 * 사용자 브라우저 언어 감지 함수
 * @returns {string} 감지된 언어 코드 (ko, en, ja)
 */
function detectUserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.includes('ko')) {
    return 'ko';
  } else if (browserLang.includes('ja')) {
    return 'ja';
  } else if (browserLang.includes('en')) {
    return 'en';
  } else {
    return 'ko'; // 기본값을 한국어로 설정
  }
}

/**
 * 국기 이미지 업데이트 함수
 * @param {string} lang - 선택된 언어 코드
 */
function updateFlag(lang) {
  const languageSelect = document.getElementById('languageSelect');
  const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
  const currentFlag = document.getElementById('currentFlag');
  const mobileFlagIcon = document.getElementById('mobileFlagIcon');
  
  // 데스크톱 국기 업데이트
  if (languageSelect && currentFlag) {
    const selectedOption = languageSelect.querySelector(`option[value="${lang}"]`);
    if (selectedOption) {
      currentFlag.src = selectedOption.getAttribute('data-flag');
      currentFlag.alt = selectedOption.getAttribute('data-flag-alt');
    }
  }
  
  // 모바일 국기 업데이트
  if (mobileLanguageSelect && mobileFlagIcon) {
    const selectedOption = mobileLanguageSelect.querySelector(`option[value="${lang}"]`);
    if (selectedOption) {
      mobileFlagIcon.src = selectedOption.getAttribute('data-flag');
      mobileFlagIcon.alt = selectedOption.getAttribute('data-flag-alt');
    }
  }
}

/**
 * 언어 텍스트 업데이트 함수
 */
function updateLanguage() {
  // 언어 선택기 중 하나를 사용해 현재 언어 확인
  const languageSelect = document.getElementById('languageSelect') || document.getElementById('mobileLanguageSelect');
  
  if (!languageSelect) return;
  
  const currentLanguage = languageSelect.value;
  
  // 일반 텍스트 요소 업데이트
  const elements = document.querySelectorAll(`[data-lang-${currentLanguage}]`);
  
  elements.forEach(el => {
    const langText = el.getAttribute(`data-lang-${currentLanguage}`);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.hasAttribute(`data-lang-placeholder-${currentLanguage}`)) {
        el.placeholder = el.getAttribute(`data-lang-placeholder-${currentLanguage}`);
      }
    } else {
      // HTML 엔티티를 실제 HTML로 변환
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = langText;
      el.innerHTML = tempDiv.innerHTML;
    }
  });
  
  // 옵션 요소 특별 처리
  const options = document.querySelectorAll('option[data-lang-' + currentLanguage + ']');
  options.forEach(option => {
    option.textContent = option.getAttribute('data-lang-' + currentLanguage);
  });
  
  // 스크롤 인디케이터 언어 업데이트
  const scrollText = document.querySelector('.home-scroll-text');
  if (scrollText) {
    const langText = scrollText.getAttribute(`data-lang-${currentLanguage}`);
    if (langText) {
      scrollText.textContent = langText;
    }
  }
}s