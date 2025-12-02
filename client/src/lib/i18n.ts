import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          system_online: 'SYSTEM ONLINE',
          global_jurisdiction: 'Global Jurisdiction',
          quick_stats: 'Quick Stats',
          current_jurisdiction: 'Current Jurisdiction',
          protected_posts: 'Protected Posts',
          risk_averted: 'Risk Averted',
          connected_platforms: 'Connected Platforms',
          manual_analysis: 'Manual Analysis',
          input_parameters: 'INPUT PARAMETERS',
          secure_channel: 'SECURE CHANNEL',
          target_platform: 'Target Platform',
          jurisdiction: 'Jurisdiction',
          content_stream: 'Content Stream',
          initiate_analysis: 'INITIATE ANALYSIS >',
          analyzing: 'ANALYZING...',
          risk_score: 'Risk Score',
          verdict: 'VERDICT',
          awaiting_data: 'AWAITING DATA STREAM',
          enter_content: 'Enter content to initiate legal risk analysis protocol.',
          open_simulator: 'Open Simulator'
        }
      },
      de: {
        translation: {
          system_online: 'SYSTEM ONLINE',
          global_jurisdiction: 'Globale Rechtsprechung',
          quick_stats: 'Schnellstatistiken',
          current_jurisdiction: 'Aktuelle Rechtsprechung',
          protected_posts: 'Geschützte Beiträge',
          risk_averted: 'Risiko Abgewendet',
          connected_platforms: 'Verbundene Plattformen',
          manual_analysis: 'Manuelle Analyse',
          input_parameters: 'EINGABEPARAMETER',
          secure_channel: 'SICHERER KANAL',
          target_platform: 'Zielplattform',
          jurisdiction: 'Rechtsprechung',
          content_stream: 'Inhaltsstrom',
          initiate_analysis: 'ANALYSE STARTEN >',
          analyzing: 'ANALYSIERE...',
          risk_score: 'Risikowert',
          verdict: 'URTEIL',
          awaiting_data: 'WARTE AUF DATENSTROM',
          enter_content: 'Geben Sie Inhalt ein, um das Protokoll zur rechtlichen Risikoanalyse zu starten.',
          open_simulator: 'Simulator Öffnen'
        }
      },
      ar: {
        translation: {
          system_online: 'النظام متصل',
          global_jurisdiction: 'الاختصاص القضائي العالمي',
          quick_stats: 'إحصائيات سريعة',
          current_jurisdiction: 'الاختصاص القضائي الحالي',
          protected_posts: 'المشاركات المحمية',
          risk_averted: 'تم تجنب المخاطر',
          connected_platforms: 'المنصات المتصلة',
          manual_analysis: 'تحليل يدوي',
          input_parameters: 'معلمات الإدخال',
          secure_channel: 'قناة آمنة',
          target_platform: 'المنصة المستهدفة',
          jurisdiction: 'الاختصاص القضائي',
          content_stream: 'تدفق المحتوى',
          initiate_analysis: 'بدء التحليل >',
          analyzing: 'جاري التحليل...',
          risk_score: 'درجة المخاطرة',
          verdict: 'الحكم',
          awaiting_data: 'في انتظار تدفق البيانات',
          enter_content: 'أدخل المحتوى لبدء بروتوكول تحليل المخاطر القانونية.',
          open_simulator: 'فتح المحاكي'
        }
      },
      tr: {
        translation: {
          system_online: 'SİSTEM ÇEVRİMİÇİ',
          global_jurisdiction: 'Küresel Yargı',
          quick_stats: 'Hızlı İstatistikler',
          current_jurisdiction: 'Mevcut Yargı',
          protected_posts: 'Korunan Gönderiler',
          risk_averted: 'Önlenen Risk',
          connected_platforms: 'Bağlı Platformlar',
          manual_analysis: 'Manuel Analiz',
          input_parameters: 'GİRİŞ PARAMETRELERİ',
          secure_channel: 'GÜVENLİ KANAL',
          target_platform: 'Hedef Platform',
          jurisdiction: 'Yargı',
          content_stream: 'İçerik Akışı',
          initiate_analysis: 'ANALİZİ BAŞLAT >',
          analyzing: 'ANALİZ EDİLİYOR...',
          risk_score: 'Risk Skoru',
          verdict: 'KARAR',
          awaiting_data: 'VERİ AKIŞI BEKLENİYOR',
          enter_content: 'Yasal risk analizi protokolünü başlatmak için içerik girin.',
          open_simulator: 'Simülatörü Aç'
        }
      },
      zh: {
        translation: {
          system_online: '系统在线',
          global_jurisdiction: '全球管辖权',
          quick_stats: '快速统计',
          current_jurisdiction: '当前管辖权',
          protected_posts: '受保护的帖子',
          risk_averted: '规避风险',
          connected_platforms: '已连接平台',
          manual_analysis: '手动分析',
          input_parameters: '输入参数',
          secure_channel: '安全通道',
          target_platform: '目标平台',
          jurisdiction: '管辖权',
          content_stream: '内容流',
          initiate_analysis: '启动分析 >',
          analyzing: '分析中...',
          risk_score: '风险评分',
          verdict: '结论',
          awaiting_data: '等待数据流',
          enter_content: '输入内容以启动法律风险分析协议。',
          open_simulator: '打开模拟器'
        }
      }
    }
  });

export default i18n;
