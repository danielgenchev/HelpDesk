// src/auth.js
import { supabase } from './supabase.js';

// Проверява кой е логнат в момента
export async function getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
}

// Задължава потребителя да е логнат (иначе го гони към login.html)
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Вход
export async function loginUser(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
}

// Регистрация
export async function registerUser(email, password, fullName) {
    return await supabase.auth.signUp({
        email, 
        password, 
        options: { data: { full_name: fullName } }
    });
}

// Изход
export async function logoutUser() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// Проверка дали потребителят е Админ
export function isAdmin(user) {
    if (!user) return false;
    return user.email === 'demo@helpdesk.local';
}