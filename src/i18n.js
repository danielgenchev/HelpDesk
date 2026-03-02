// src/i18n.js

export const dictionary = {
    en: {
        brand: "IT Help Desk", settingsBtn: "⚙️ Settings", logoutBtn: "Logout",
        myTicketsTitle: "My Tickets", allTicketsTitle: "All Tickets (Admin)",
        createTicketBtn: "+ Create New Ticket", noTickets: "No tickets found", noTicketsDesc: "You haven't created any support tickets yet.",
        thTitle: "Title", thAuthor: "Author", thPriority: "Priority", thStatus: "Status", thDate: "Date", thActions: "Actions", viewBtn: "View",
        status_open: "open", status_inprogress: "in progress", status_closed: "closed", status_resolved: "resolved",
        priority_low: "low", priority_medium: "medium", priority_high: "high"
    },
    bg: {
        brand: "IT Help Desk", settingsBtn: "⚙️ Настройки", logoutBtn: "Изход",
        myTicketsTitle: "Моите Тикети", allTicketsTitle: "Всички Тикети (Админ)",
        createTicketBtn: "+ Създай Тикет", noTickets: "Няма тикети", noTicketsDesc: "Все още нямате създадени тикети.",
        thTitle: "Заглавие", thAuthor: "Автор", thPriority: "Приоритет", thStatus: "Статус", thDate: "Дата", thActions: "Действия", viewBtn: "Преглед",
        status_open: "отворен", status_inprogress: "в процес", status_closed: "затворен", status_resolved: "решен",
        priority_low: "нисък", priority_medium: "среден", priority_high: "висок"
    }
};

export function getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
}

export function setLang(lang) {
    localStorage.setItem('lang', lang);
}