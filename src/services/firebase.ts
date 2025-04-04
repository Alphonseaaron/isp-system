
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCN9FD6-5H-tsB1tDICBHJO7K8CK_SbP8",
  authDomain: "breamtwifi.firebaseapp.com",
  projectId: "breamtwifi",
  storageBucket: "breamtwifi.firebasestorage.app",
  messagingSenderId: "834262227586",
  appId: "1:834262227586:web:9a8247bf51b60a7a4cb29b",
  measurementId: "G-D3TDS7PX0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions for packages collection
export const savePackage = async (packageData: any) => {
  try {
    const packagesCollection = collection(db, "packages");
    const docRef = await addDoc(packagesCollection, {
      ...packageData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...packageData };
  } catch (error) {
    console.error("Error saving package:", error);
    throw error;
  }
};

export const updatePackage = async (id: string, packageData: any) => {
  try {
    const packageRef = doc(db, "packages", id);
    await updateDoc(packageRef, {
      ...packageData,
      updatedAt: Timestamp.now()
    });
    return { id, ...packageData };
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
};

export const deletePackage = async (id: string) => {
  try {
    const packageRef = doc(db, "packages", id);
    await deleteDoc(packageRef);
    return id;
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};

export const getPackages = async () => {
  try {
    const packagesCollection = collection(db, "packages");
    const querySnapshot = await getDocs(packagesCollection);
    const packages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return packages;
  } catch (error) {
    console.error("Error getting packages:", error);
    throw error;
  }
};

// Transaction functions for M-Pesa payments
export const saveTransaction = async (transactionData: any) => {
  try {
    const transactionsCollection = collection(db, "transactions");
    const docRef = await addDoc(transactionsCollection, {
      ...transactionData,
      timestamp: Timestamp.now(),
      status: "pending"
    });
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};

export const updateTransactionStatus = async (id: string, status: string) => {
  try {
    const transactionRef = doc(db, "transactions", id);
    await updateDoc(transactionRef, {
      status,
      updatedAt: Timestamp.now()
    });
    return { id, status };
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// User session functions
export const saveSession = async (sessionData: any) => {
  try {
    const sessionsCollection = collection(db, "sessions");
    const docRef = await addDoc(sessionsCollection, {
      ...sessionData,
      startTime: Timestamp.now(),
      isActive: true
    });
    return { id: docRef.id, ...sessionData };
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
};

export const updateSession = async (id: string, sessionData: any) => {
  try {
    const sessionRef = doc(db, "sessions", id);
    await updateDoc(sessionRef, {
      ...sessionData,
      updatedAt: Timestamp.now()
    });
    return { id, ...sessionData };
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

export { auth, db };
