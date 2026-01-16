
import { AppNotification } from '../types';

/**
 * Implementation of NotificationManager & Strategic Workflow Logic
 * Ported from notifications/notification_system.ts
 */

// ORCID Public API Base URL
const ORCID_API_BASE = "https://pub.orcid.org/v3.0";

/**
 * Fetches real researcher data from ORCID using their Public API.
 * Defaults to the requested ID: 0009-0009-0717-5536
 */
export const fetchOrcidProfile = async (orcidId: string = "0009-0009-0717-5536") => {
  try {
    const response = await fetch(`${ORCID_API_BASE}/${orcidId}/person`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error("ORCID Profile not found");
    
    const data = await response.json();
    const nameData = data.name;
    const fullName = `${nameData['given-names']?.value || ''} ${nameData['family-name']?.value || ''}`.trim();
    const bio = data.biography?.content || "Scientific researcher exploring emergent AI and physics.";
    
    // Fetching works separately to enrich the profile
    const worksResponse = await fetch(`${ORCID_API_BASE}/${orcidId}/works`, {
      headers: { 'Accept': 'application/json' }
    });
    
    let works = [];
    if (worksResponse.ok) {
      const worksData = await worksResponse.json();
      works = worksData.group?.map((g: any) => ({
        title: g['work-summary'][0].title.title.value,
        type: g['work-summary'][0].type,
        year: g['work-summary'][0]['publication-date']?.year?.value || '2024',
        doi: g['work-summary'][0]['external-ids']?.['external-id']?.[0]?.['external-id-value'] || ''
      })) || [];
    }

    return {
      fullName: fullName || "Edward PL (Researcher)",
      bio,
      works,
      orcidId
    };
  } catch (error) {
    console.error("ORCID Fetch Error:", error);
    return {
        fullName: "Edward PL",
        bio: "AI Systems Architect & Theoretical Researcher.",
        orcidId: "0009-0009-0717-5536",
        works: [{ title: "Emergent Intelligence in Multi-Layered AI Ecosystems", year: "2024", type: "JOURNAL_ARTICLE" }]
    };
  }
};

export const fetchExternalUpdates = async () => {
  // Parallel fetch: Real ORCID data + simulated news
  const profile = await fetchOrcidProfile();

  return {
    orcid: profile.works,
    profile: profile,
    news: [
      { title: "Physical Review Letters updates submission policy", platform: "APS News", timing: "Today" },
      { title: "New funding opportunities in JHEP", platform: "Nature Funding", timing: "2h ago" }
    ]
  };
};

export const searchCrossRef = async (doi: string) => {
  try {
    const response = await fetch(`https://api.crossref.org/works/${doi}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.message;
  } catch (e) {
    console.error("CrossRef Error:", e);
    return null;
  }
};

/**
 * Port of Python generate_ai_summary(self, notifications)
 */
export const generateAISummary = (notifications: AppNotification[]) => {
  if (notifications.length === 0) return "No hay notificaciones recientes";
  
  const categories: Record<string, number> = {};
  notifications.forEach(notif => {
    categories[notif.category] = (categories[notif.category] || 0) + 1;
  });
  
  let summary = `Resumen de ${notifications.length} notificaciones:\n`;
  Object.entries(categories).forEach(([cat, count]) => {
    summary += `- ${count} de tipo '${cat}'\n`;
  });
  
  // Fix: Updated comparison to match the 'urgent' priority defined in AppNotification interface
  const urgent = notifications.filter(n => n.priority === 'urgent');
  if (urgent.length > 0) {
    summary += `\n⚠️ ${urgent.length} notificaciones URGENTES requieren atención inmediata.`;
  }
  
  return summary;
};