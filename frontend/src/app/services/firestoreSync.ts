import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '../contexts/AuthContext';

/**
 * Sync user profile to Firestore
 */
export async function syncUserToFirestore(user: Partial<User> & { id: string; email: string }, extraData: Record<string, unknown> = {}) {
  try {
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, {
      id: user.id,
      email: user.email.toLowerCase(),
      name: user.name || user.email.split('@')[0],
      role: user.role || 'customer',
      avatar: user.avatar || null,
      verified: !!user.verified,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...extraData,
    }, { merge: true });
    console.log(`[Firestore] Synced user ${user.email} (${user.id}) to 'users' collection`);
  } catch (err) {
    console.warn('[Firestore] Error syncing user to Firestore:', err);
  }
}

/**
 * Sync a posted job to Firestore 'jobs' collection
 */
export async function syncJobToFirestore(jobData: {
  title: string;
  description: string;
  category: string;
  budget_amount: number;
  budget_type: string;
  location: string;
  urgency: string;
  skills: string[];
  postedBy?: string;
  postedByEmail?: string;
}) {
  try {
    const jobsRef = collection(db, 'jobs');
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      status: 'open',
      applicants: 0,
      createdAt: serverTimestamp(),
      postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    console.log(`[Firestore] Synced job ${jobData.title} with docId: ${docRef.id}`);
    return docRef.id;
  } catch (err) {
    console.warn('[Firestore] Error syncing job to Firestore:', err);
    return null;
  }
}

/**
 * Send real-time message to Firestore
 */
export async function sendFirestoreMessage(
  channelId: string,
  message: {
    senderId: string;
    senderName?: string;
    text: string;
  }
) {
  try {
    const channelRef = doc(db, 'chats', channelId);
    await setDoc(channelRef, {
      lastMessage: message.text,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    const messagesRef = collection(db, 'chats', channelId, 'messages');
    const docRef = await addDoc(messagesRef, {
      senderId: message.senderId,
      senderName: message.senderName || 'Anonymous',
      text: message.text,
      createdAt: serverTimestamp(),
      timestampStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    });
    return docRef.id;
  } catch (err) {
    console.warn('[Firestore] Error sending message to Firestore:', err);
    return null;
  }
}

/**
 * Subscribe to real-time messages for a channel
 */
export function subscribeToChannelMessages(
  channelId: string,
  onUpdate: (messages: Array<{ id: string; senderId: string; text: string; timestamp: string; status: 'sent' | 'delivered' | 'read' }>) => void
) {
  try {
    const messagesRef = collection(db, 'chats', channelId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const msgs = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        let time = data.timestampStr || '';
        if (!time && data.createdAt) {
          const date = (data.createdAt as Timestamp).toDate ? (data.createdAt as Timestamp).toDate() : new Date();
          time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return {
          id: docSnap.id,
          senderId: data.senderId || 'unknown',
          text: data.text || '',
          timestamp: time || 'Just now',
          status: (data.status as 'sent' | 'delivered' | 'read') || 'delivered',
        };
      });
      onUpdate(msgs);
    }, (error) => {
      console.warn('[Firestore] Snapshot listener error:', error);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('[Firestore] Error setting up channel listener:', err);
    return () => {};
  }
}

/**
 * Seed initial sample users and jobs so the Firestore Database is instantly populated
 */
export async function seedFirestoreIfEmpty() {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    if (!snap.empty) {
      console.log('[Firestore] Database already contains records.');
      return;
    }

    console.log('[Firestore] Populating initial demo records in Firestore...');

    // Seed Demo Users
    const demoUsers = [
      {
        id: 'user_worker_1',
        email: 'worker@example.com',
        name: 'Sarah Johnson',
        role: 'worker',
        title: 'Professional Plumber',
        skills: ['Pipe Repair', 'Drain Cleaning', 'Water Heater', 'Bathroom Remodel'],
        rating: 4.9,
        hourlyRate: 65,
        location: 'Brooklyn, NY',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      {
        id: 'user_worker_2',
        email: 'michael@example.com',
        name: 'Michael Chen',
        role: 'worker',
        title: 'Certified Electrician',
        skills: ['Wiring', 'Panel Upgrades', 'Lighting', 'Circuit Repair'],
        rating: 4.8,
        hourlyRate: 75,
        location: 'Manhattan, NY',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      },
      {
        id: 'user_customer_1',
        email: 'customer@example.com',
        name: 'Jane Smith',
        role: 'customer',
        company: 'Acme Home Services',
        location: 'Brooklyn, NY',
        verified: true,
      },
      {
        id: 'user_admin_1',
        email: 'admin@example.com',
        name: 'System Admin',
        role: 'admin',
        location: 'New York, NY',
        verified: true,
      }
    ];

    for (const u of demoUsers) {
      await setDoc(doc(db, 'users', u.id), {
        ...u,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Seed Initial Jobs
    const jobs = [
      {
        title: 'Kitchen Sink Drainage Pipe Replacement',
        description: 'Need an experienced plumber to replace a leaking kitchen drainage PVC pipe assembly in a 2nd floor apartment.',
        category: 'Plumbing',
        budget_amount: 180,
        budget_type: 'fixed',
        location: 'Brooklyn, NY',
        urgency: 'high',
        skills: ['Plumbing', 'Pipe Repair'],
        status: 'open',
        applicants: 2,
        postedBy: 'Jane Smith',
        postedDate: 'Today',
      },
      {
        title: 'Living Room Ceiling Fan & Recessed Lighting Installation',
        description: 'Install 4 recessed LED pot lights and replace existing fixture with a heavy-duty smart ceiling fan.',
        category: 'Electrical',
        budget_amount: 320,
        budget_type: 'fixed',
        location: 'Manhattan, NY',
        urgency: 'medium',
        skills: ['Electrical', 'Lighting'],
        status: 'open',
        applicants: 1,
        postedBy: 'Jane Smith',
        postedDate: 'Yesterday',
      }
    ];

    for (const j of jobs) {
      await addDoc(collection(db, 'jobs'), {
        ...j,
        createdAt: serverTimestamp(),
      });
    }

    console.log('[Firestore] Successfully populated demo users and jobs in Cloud Firestore!');
  } catch (err) {
    console.warn('[Firestore] Error auto-seeding Firestore:', err);
  }
}
