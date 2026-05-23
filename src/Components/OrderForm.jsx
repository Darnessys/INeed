import React, { useState, useEffect, useRef } from 'react';
import { createOrder } from '../Services/OrderService';
import '../Components/OrderForm.css';

function OrderForm() {
  const [activeTab, setActiveTab] = useState('voice'); 
  const [voiceStatus, setVoiceStatus] = useState('idle'); 
  const [orderData, setOrderData] = useState({ text: '', audio: null });
  
  // ريفرنس للمترجم الصوتي
  const recognitionRef = useRef(null);

  useEffect(() => {
    // إعداد المترجم الصوتي المدمج في المتصفح
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // يفضل يسمع لحد ما العميل يوقف بنفسه
      recognition.interimResults = false; // ميتكلمش غير لما يخلص الجملة
      recognition.lang = 'ar-EG'; // تحديد اللهجة المصرية بالمللي 🇪🇬

      // لما العميل يخلص كلام ويقفل، النتيجة بتيجي هنا
      recognition.onresult = (event) => {
        let currentResult = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentResult += event.results[i][0].transcript;
        }
        if (currentResult) {
          setOrderData((prev) => ({ ...prev, text: prev.text + ' ' + currentResult }));
        }
      };

      recognition.onerror = (event) => {
        console.error("خطأ في المايك يا هندسة:", event.error);
        if (event.error === 'not-allowed') {
          alert("لازم تدي المتصفح صلاحية المايك من إعدادات الموبايل يا باشا! 🎤");
        }
        setVoiceStatus('idle');
      };

      recognition.onend = () => {
        // لو قفل لوحده نضمن إن الـ State تتحدث
        setVoiceStatus('review');
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("المتصفح ده مش بيدعم تسجيل الصوت المباشر");
    }
  }, []);

  // التحكم في بدء وتوقف التسجيل الحقيقي
  const handleRecordClick = () => {
    if (!recognitionRef.current) {
      alert("المتصفح بتاعك مش بيدعم المايك، جرب افتحه من جوجل كروم يا هندسة");
      return;
    }

    if (voiceStatus === 'idle') {
      setVoiceStatus('recording');
      setOrderData({ text: '', audio: null }); // تصفير النص القديم لبدء طلب جديد
      recognitionRef.current.start(); // تشغيل المايك الحقيقي
    } else if (voiceStatus === 'recording') {
      recognitionRef.current.stop(); // إيقاف المايك، وهيحولنا أوتوماتيك لـ review
    }
  };

  const handleResetVoice = () => {
    if (voiceStatus === 'recording' && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setOrderData({ text: '', audio: null });
    setVoiceStatus('idle');
  };

  const handleSend = async () => {
    if (activeTab === 'voice' && voiceStatus === 'idle') return;
    if (activeTab === 'text' && !orderData.text.trim()) return;

    try {
      // إرسال الطلب والنص الحقيقي للـ Firebase لاحقاً
      await createOrder("user_123", orderData.text, 50);
      alert("أبشر يا باشا! طلبك انطلق للمندوب فوراً 🛵✨");
      setOrderData({ text: '', audio: null });
      setVoiceStatus('idle');
    } catch (error) {
      console.error(error);
      alert("شيك على اتصال السيرفر يا هندسة");
    }
  };

  return (
    <div className="order-container">
      <h2>أهلاً يا باشا، محتاج إيه؟ 🛵</h2>

      <div className="tab-switcher">
        <button 
          className={`tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => { setActiveTab('voice'); handleResetVoice(); }}
        >
          👑 تسجيل صوّتي ملكي
        </button>
        <button 
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => { setActiveTab('text'); handleResetVoice(); }}
        >
          ✍️ كتابة طلب فخم
        </button>
      </div>

      {activeTab === 'voice' && (
        <div className="view-zone">
          {voiceStatus === 'idle' && (
            <div className="action-zone">
              <button className="giant-record-btn" onClick={handleRecordClick}>
                <span className="mic-icon">🎤</span>
                <p>اضغط وامرنا بطلبك</p>
              </button>
            </div>
          )}

          {voiceStatus === 'recording' && (
            <div className="action-zone">
              <button className="giant-record-btn recording" onClick={handleRecordClick}>
                <span className="mic-icon">🛑</span>
                <p>أنا سامعك.. اضغط هنا لما تخلص</p>
              </button>
            </div>
          )}

          {voiceStatus === 'review' && (
            <div className="review-zone">
              <div className="audio-card">
                <span>✨ طلبك الصوتي جاهز:</span>
                <div className="mock-player">🔊 متسجل بنجاح</div>
                <button className="delete-btn" onClick={handleResetVoice}>🗑️ إعادة المحاولة</button>
              </div>

              <div className="input-wrapper">
                <label>📜 نص الطلب المكتوب أوتوماتيكياً (تقدر تعدله):</label>
                <textarea 
                  value={orderData.text}
                  onChange={(e) => setOrderData({...orderData, text: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'text' && (
        <div className="view-zone">
          <div className="input-wrapper">
            <label>📜 اكتب الأوامر والطلبات بالمللي:</label>
            <textarea 
              placeholder="اكتب هنا ما يشتهيه بيتك الموقر..."
              value={orderData.text}
              onChange={(e) => setOrderData({...orderData, text: e.target.value})}
            />
          </div>
        </div>
      )}

      <div className="location-box">
        <p>📍 المندوب سيتوجه إلى: حي المعادي، شارع 9</p>
      </div>

      <button 
        className={`submit-btn ${(activeTab === 'text' && orderData.text.trim()) || (voiceStatus === 'review' && orderData.text.trim()) ? 'ready' : ''}`} 
        onClick={handleSend}
      >
        تأكيد وإرسال الطلب 🚀
      </button>
    </div>
  );
}

export default OrderForm;