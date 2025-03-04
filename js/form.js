/**
 * form.js - 문의 양식 처리 기능
 */

/**
 * 폼 모듈 초기화 함수
 */
function initializeForm() {
  const contactForm = document.getElementById('contactForm');
  const submitButton = document.getElementById('submitBtn');
  const errorMessage = document.getElementById('errorMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 로딩 상태 표시
      const languageSelect = document.getElementById('languageSelect');
      const currentLanguage = languageSelect.value;
      const originalButtonText = submitButton.textContent;
      const loadingText = submitButton.getAttribute(`data-lang-loading-${currentLanguage}`) || "Sending...";
      
      submitButton.textContent = loadingText;
      submitButton.disabled = true;
      submitButton.classList.add('loading');
      errorMessage.style.display = 'none';
      
      // 폼 데이터 가져오기
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const projectType = formData.get('project');
      const message = formData.get('message');
      
      // 프로젝트 유형 라벨 가져오기 (값이 아닌 텍스트)
      const projectSelect = document.getElementById('project');
      const selectedOption = projectSelect.options[projectSelect.selectedIndex];
      const projectTypeLabel = selectedOption.textContent;
      
      // 템플릿 파라미터 준비
      const templateParams = {
        from_name: name,
        from_email: email,
        phone_number: phone,
        project_type: projectTypeLabel,
        project_type_value: projectType,
        message: message,
        reply_to: email
      };
      
      // EmailJS로 이메일 전송
      emailjs.send("pikaia556", "template_cl5pmsa", templateParams)
        .then(function(response) {
          console.log("SUCCESS!", response.status, response.text);
          
          // 폼 초기화 및 성공 팝업 표시
          contactForm.reset();
          showPopup();
          
          // 버튼 상태 복원
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          submitButton.classList.remove('loading');
        })
        .catch(function(error) {
          console.error("FAILED...", error);
          
          // 오류 메시지 표시
          errorMessage.style.display = 'block';
          errorMessage.textContent = errorMessage.getAttribute(`data-lang-${currentLanguage}`);
          
          // 버튼 상태 복원
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          submitButton.classList.remove('loading');
        });
    });
  }
}