import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase.js';

// COLLECTION NAMES
const USERS_COLLECTION = 'users';
const EXPENSES_COLLECTION = 'expenses';
const INCOME_COLLECTION = 'income';
const COUNTERS_COLLECTION = 'counters';

// ==================== COUNTER OPERATIONS ====================

const getCounterRef = (userId, counterType) => {
  return doc(db, COUNTERS_COLLECTION, `${userId}_${counterType}`);
};

const getNextSequenceNumber = async (userId, counterType) => {
  const counterRef = getCounterRef(userId, counterType);
  
  try {
    const result = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let newCount;
      
      if (!counterDoc.exists()) {
        // Create counter document if it doesn't exist
        newCount = 1;
        transaction.set(counterRef, {
          count: newCount,
          lastUpdated: serverTimestamp(),
        });
      } else {
        // Increment existing counter
        const currentCount = counterDoc.data().count;
        newCount = currentCount + 1;
        transaction.update(counterRef, {
          count: newCount,
          lastUpdated: serverTimestamp(),
        });
      }
      
      return newCount;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting next sequence number:', error);
    throw error;
  }
};

// ==================== USER OPERATIONS ====================

export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }

    const newUser = {
      id: userId,
      email: userData.email || '',
      userName: userData.displayName || userData.email?.split('@')[0] || 'User',
      phoneNumber: userData.phoneNumber || '',
      photoURL: userData.photoURL || '',
      currency: 'PKR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      isActive: true,
      isEmailVerified: userData.emailVerified || false,
      lastLoginAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
    };

    await setDoc(userRef, newUser);
    return { success: true, data: newUser };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, data: userDoc.data() };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserLastSeen = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      lastSeenAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating last seen:', error);
    return { success: false, error: error.message };
  }
};

// ==================== EXPENSE OPERATIONS ====================

export const createExpense = async (userId, expenseData) => {
  try {
    // Get next sequence number (transaction handles counter creation if needed)
    const sequenceNumber = await getNextSequenceNumber(userId, 'expense');
    
    const expenseRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
      id: '', // Will be set by document ID
      sequenceNumber: sequenceNumber,
      title: expenseData.title,
      description: expenseData.description || '',
      amount: parseFloat(expenseData.amount),
      currency: expenseData.currency || 'PKR',
      category: expenseData.category || { id: 'other', name: 'Other' },
      paymentMethod: expenseData.paymentMethod || 'cash',
      expenseDate: expenseData.expenseDate || serverTimestamp(),
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
    });

    // Update the document with its own ID
    await updateDoc(expenseRef, { id: expenseRef.id });

    return { success: true, id: expenseRef.id, sequenceNumber };
  } catch (error) {
    console.error('Error creating expense:', error);
    return { success: false, error: error.message };
  }
};

export const getExpenses = async (userId) => {
  try {
    const expensesQuery = query(
      collection(db, EXPENSES_COLLECTION),
      where('userId', '==', userId),
      where('deletedAt', '==', null)
    );

    const querySnapshot = await getDocs(expensesQuery);
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ ...doc.data(), id: doc.id });
    });

    // Sort client-side by sequenceNumber descending (newest first)
    expenses.sort((a, b) => {
      const seqA = a.sequenceNumber || 0;
      const seqB = b.sequenceNumber || 0;
      return seqB - seqA;
    });

    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error getting expenses:', error);
    return { success: false, error: error.message };
  }
};

export const getExpense = async (expenseId) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    const expenseDoc = await getDoc(expenseRef);

    if (!expenseDoc.exists()) {
      return { success: false, error: 'Expense not found' };
    }

    return { success: true, data: expenseDoc.data() };
  } catch (error) {
    console.error('Error getting expense:', error);
    return { success: false, error: error.message };
  }
};

export const updateExpense = async (expenseId, updates) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await updateDoc(expenseRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, error: error.message };
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await updateDoc(expenseRef, {
      deletedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: error.message };
  }
};

// ==================== INCOME OPERATIONS ====================

export const createIncome = async (userId, incomeData) => {
  try {
    // Get next sequence number (transaction handles counter creation if needed)
    const sequenceNumber = await getNextSequenceNumber(userId, 'income');
    
    const incomeRef = await addDoc(collection(db, INCOME_COLLECTION), {
      id: '', // Will be set by document ID
      sequenceNumber: sequenceNumber,
      title: incomeData.title,
      description: incomeData.description || '',
      amount: parseFloat(incomeData.amount),
      currency: incomeData.currency || 'PKR',
      source: incomeData.source || { id: 'other', name: 'Other' },
      incomeDate: incomeData.incomeDate || serverTimestamp(),
      paymentMethod: incomeData.paymentMethod || 'bank',
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
    });

    // Update the document with its own ID
    await updateDoc(incomeRef, { id: incomeRef.id });

    return { success: true, id: incomeRef.id, sequenceNumber };
  } catch (error) {
    console.error('Error creating income:', error);
    return { success: false, error: error.message };
  }
};

export const getIncome = async (userId) => {
  try {
    const incomeQuery = query(
      collection(db, INCOME_COLLECTION),
      where('userId', '==', userId),
      where('deletedAt', '==', null)
    );

    const querySnapshot = await getDocs(incomeQuery);
    const incomeRecords = [];
    querySnapshot.forEach((doc) => {
      incomeRecords.push({ ...doc.data(), id: doc.id });
    });

    // Sort client-side by sequenceNumber descending (newest first)
    incomeRecords.sort((a, b) => {
      const seqA = a.sequenceNumber || 0;
      const seqB = b.sequenceNumber || 0;
      return seqB - seqA;
    });

    return { success: true, data: incomeRecords };
  } catch (error) {
    console.error('Error getting income:', error);
    return { success: false, error: error.message };
  }
};

export const getIncomeById = async (incomeId) => {
  try {
    const incomeRef = doc(db, INCOME_COLLECTION, incomeId);
    const incomeDoc = await getDoc(incomeRef);

    if (!incomeDoc.exists()) {
      return { success: false, error: 'Income not found' };
    }

    return { success: true, data: incomeDoc.data() };
  } catch (error) {
    console.error('Error getting income:', error);
    return { success: false, error: error.message };
  }
};

export const updateIncome = async (incomeId, updates) => {
  try {
    const incomeRef = doc(db, INCOME_COLLECTION, incomeId);
    await updateDoc(incomeRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating income:', error);
    return { success: false, error: error.message };
  }
};

export const deleteIncome = async (incomeId) => {
  try {
    const incomeRef = doc(db, INCOME_COLLECTION, incomeId);
    await updateDoc(incomeRef, {
      deletedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting income:', error);
    return { success: false, error: error.message };
  }
};
