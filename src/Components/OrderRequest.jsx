import React, { useState } from 'react';
import { createOrder } from './services/OrderService'; // استدعاء الموظف المسؤول عن حفظ الطلب في Firebase

const OrderRequest = ({ userProfile }) => {
  // حالة الفورم: بنخزن فيها الوصف وقيمة التوصيل اللي العميل بيكتبهم
  const [formData, setFormData] = useState({ description: '', fee: '' });
  
  // حالة الإرسال: بنستخدمها عشان نمنع العميل من الضغط على الزرار أكتر من مرة (User Experience)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دالة الإرسال: اللي بتشتغل لما العميل يدوس "تأكيد الطلب"
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع الصفحة من الـ Refresh التلقائي
    
    // 1. هندسة: التأكد من سلامة البيانات قبل ما نبعتها للمخزن (Firebase)
    if (formData.description.length < 5) {
      alert("من فضلك اكتب وصف أوضح للطلب.");
      return;
    }

    // تفعيل حالة التحميل عشان العميل يعرف إن السيستم شغال
    setIsSubmitting(true);
    
    try {
      // 2. التواصل مع "الموظف" (OrderService.js):
      // بنبعت الـ ID بتاع العميل، الوصف، وقيمة التوصيل (بنحولها لرقم)
      await createOrder(userProfile.id, formData.description, Number(formData.fee));
      
      // نجاح العملية: بنعرف العميل وننظف الخانات عشان يطلب طلب جديد لو عايز
      alert("تم إرسال طلبك بنجاح!");
      setFormData({ description: '', fee: '' }); 
    } catch (e) {
      // التعامل مع أي خطأ (زي انقطاع النت مثلاً)
      alert("حدث خطأ، حاول مرة أخرى.");
    } finally {
      // إيقاف حالة التحميل سواء العملية نجحت أو فشلت
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ineed-request-container">
      <h2>أطلب الآن عبر INeed</h2>
      <form onSubmit={handleSubmit}>
        {/* خانة وصف الطلب */}
        <input 
          required
          placeholder="إيه اللي محتاجه؟" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        
        {/* خانة قيمة التوصيل */}
        <input 
          required
          type="number" 
          placeholder="قيمة التوصيل" 
          value={formData.fee}
          onChange={(e) => setFormData({...formData, fee: e.target.value})} 
        />
        
        {/* زرار الإرسال: بيتعطل أوتوماتيكياً لما نكون في حالة إرسال (isSubmitting) */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب"}
        </button>
      </form>
    </div>
  );
};

export default OrderRequest;