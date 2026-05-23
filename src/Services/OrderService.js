import { db } from "../firebaseConfig";

import { collection, addDoc, serverTimestamp, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
// ده الموظف اللي بيسجل الطلب
export const createOrder = async (requesterId, itemDescription, deliveryFee) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      requesterId: requesterId,
      itemDescription: itemDescription,
      deliveryFee: deliveryFee,
      status: "pending",
      createdAt: serverTimestamp()
    });
    
    console.log("الطلب اتسجل في المخزن برقم: ", docRef.id);
    return docRef.id; 
    
  } catch (e) {
    console.error("يا ضياء حصلت مشكلة: ", e);
    throw e; // من الأفضل نرجع الـ error عشان نعرف نتعامل معاه في الـ UI
  }
};

// ده الموظف وهو بيراقب الرف
export const watchForNewOrders = (onOrdersChanged) => {
  const q = query(collection(db, "orders"), where("status", "==", "pending"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    onOrdersChanged(orders);
  });

  return unsubscribe;
};

// الشغلة الثالثة: المندوب بيوافق على الطلب
export const acceptOrder = async (orderId, runnerId) => {
  try {
    // بنحدد الطلب بالـ ID بتاعه
    const orderRef = doc(db, "orders", orderId);

    // بنحدث حالته وبنضيف اسم المندوب
    await updateDoc(orderRef, {
      status: "accepted",
      runnerId: runnerId
    });

    console.log("تم قبول الطلب بنجاح!");
  } catch (e) {
    console.error("مشكلة في قبول الطلب: ", e);
  }
};