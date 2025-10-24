"use client"
import { auth, db } from '@/configs/firebaseConfig';
import { AuthContext } from '@/context/AuthContext';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface UserData {
  credits: number;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    refreshUserData: () => Promise<void>;
}

function Provider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const fetchUserData = async (userId: string) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                setUserData(userSnap.data() as UserData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const refreshUserData = async () => {
        if (user) {
            await fetchUserData(user.uid);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                // Save to Firestore if not exists
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                console.log(userSnap);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        createdAt: new Date(),
                        credits: 20
                    });
                    // Set initial user data
                    setUserData({
                        uid: user.uid,
                        email: user.email || '',
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        createdAt: new Date(),
                        credits: 20
                    });
                } else {
                    // Fetch existing user data
                    await fetchUserData(user.uid);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <NextThemesProvider {...props}>
            <AuthContext.Provider value={{ user, userData, refreshUserData }}>
                <div>
                    {children}
                </div>
            </AuthContext.Provider>
        </NextThemesProvider>
    )
}

// Custom hook to use auth
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export default Provider

