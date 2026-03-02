// src/api.js
import { supabase } from './supabase.js';

// Взема тикетите (всички за админа, или само личните за потребителя)
export async function getTickets(user, isAdmin) {
    let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
    
    if (!isAdmin) {
        query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

// Взема детайли за точно определен тикет
export async function getTicketById(ticketId) {
    const { data, error } = await supabase
        .from('tickets')
        .select('*, categories(name)')
        .eq('id', ticketId)
        .single();
        
    if (error) throw error;
    return data;
}

// Сменя статуса на тикет
export async function updateTicketStatus(ticketId, newStatus) {
    const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);
        
    if (error) throw error;
}

// Зарежда категориите за падащото меню
export async function getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data;
}