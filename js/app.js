/**
 * Diamond E-Commerce - Core Application Controller
 * Handles Navigation, Search Modal, Wishlist Drawer, WhatsApp Concierge, Country Selectors, and Shared Modals
 */

import './products.js';
import './i18n.js';
import './cart.js';
import './auth.js';
import './shop.js';
import './product-detail.js';
import './checkout.js';

const COUNTRIES_DATA = [
  // Primary GCC & Middle East
  { code: 'QA', dial: '+974', labelEn: 'Qatar', labelAr: 'قطر', nameEn: 'Qatar', nameAr: 'قطر', minLen: 8, maxLen: 8, placeholder: '71040746' },
  { code: 'SA', dial: '+966', labelEn: 'Saudi Arabia', labelAr: 'السعودية', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', minLen: 9, maxLen: 9, placeholder: '501234567' },
  { code: 'AE', dial: '+971', labelEn: 'UAE', labelAr: 'الإمارات', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', minLen: 9, maxLen: 9, placeholder: '501234567' },
  { code: 'KW', dial: '+965', labelEn: 'Kuwait', labelAr: 'الكويت', nameEn: 'Kuwait', nameAr: 'الكويت', minLen: 8, maxLen: 8, placeholder: '98765432' },
  { code: 'BH', dial: '+973', labelEn: 'Bahrain', labelAr: 'البحرين', nameEn: 'Bahrain', nameAr: 'البحرين', minLen: 8, maxLen: 8, placeholder: '36001234' },
  { code: 'OM', dial: '+968', labelEn: 'Oman', labelAr: 'عُمان', nameEn: 'Oman', nameAr: 'سلطنة عمان', minLen: 8, maxLen: 8, placeholder: '91234567' },
  { code: 'EG', dial: '+20', labelEn: 'Egypt', labelAr: 'مصر', nameEn: 'Egypt', nameAr: 'مصر', minLen: 10, maxLen: 10, placeholder: '1012345678' },
  { code: 'JO', dial: '+962', labelEn: 'Jordan', labelAr: 'الأردن', nameEn: 'Jordan', nameAr: 'الأردن', minLen: 9, maxLen: 9, placeholder: '791234567' },
  { code: 'LB', dial: '+961', labelEn: 'Lebanon', labelAr: 'لبنان', nameEn: 'Lebanon', nameAr: 'لبنان', minLen: 7, maxLen: 8, placeholder: '71123456' },
  { code: 'IQ', dial: '+964', labelEn: 'Iraq', labelAr: 'العراق', nameEn: 'Iraq', nameAr: 'العراق', minLen: 10, maxLen: 10, placeholder: '7701234567' },
  { code: 'MA', dial: '+212', labelEn: 'Morocco', labelAr: 'المغرب', nameEn: 'Morocco', nameAr: 'المغرب', minLen: 9, maxLen: 9, placeholder: '612345678' },
  { code: 'TN', dial: '+216', labelEn: 'Tunisia', labelAr: 'تونس', nameEn: 'Tunisia', nameAr: 'تونس', minLen: 8, maxLen: 8, placeholder: '20123456' },
  { code: 'DZ', dial: '+213', labelEn: 'Algeria', labelAr: 'الجزائر', nameEn: 'Algeria', nameAr: 'الجزائر', minLen: 9, maxLen: 9, placeholder: '551234567' },
  { code: 'PS', dial: '+970', labelEn: 'Palestine', labelAr: 'فلسطين', nameEn: 'Palestine', nameAr: 'فلسطين', minLen: 9, maxLen: 9, placeholder: '591234567' },
  { code: 'YE', dial: '+967', labelEn: 'Yemen', labelAr: 'اليمن', nameEn: 'Yemen', nameAr: 'اليمن', minLen: 9, maxLen: 9, placeholder: '771234567' },
  { code: 'SY', dial: '+963', labelEn: 'Syria', labelAr: 'سوريا', nameEn: 'Syria', nameAr: 'سوريا', minLen: 9, maxLen: 9, placeholder: '944123456' },
  { code: 'SD', dial: '+249', labelEn: 'Sudan', labelAr: 'السودان', nameEn: 'Sudan', nameAr: 'السودان', minLen: 9, maxLen: 9, placeholder: '912345678' },
  { code: 'LY', dial: '+218', labelEn: 'Libya', labelAr: 'ليبيا', nameEn: 'Libya', nameAr: 'ليبيا', minLen: 9, maxLen: 9, placeholder: '912345678' },

  // All World Countries from Spreadsheet (Alphabetical)
  { code: 'AF', dial: '+93', labelEn: 'Afghanistan', labelAr: 'أفغانستان', nameEn: 'Afghanistan', nameAr: 'أفغانستان', minLen: 9, maxLen: 9, placeholder: '701234567' },
  { code: 'AL', dial: '+355', labelEn: 'Albania', labelAr: 'ألبانيا', nameEn: 'Albania', nameAr: 'ألبانيا', minLen: 9, maxLen: 9, placeholder: '671234567' },
  { code: 'AD', dial: '+376', labelEn: 'Andorra', labelAr: 'أندورا', nameEn: 'Andorra', nameAr: 'أندورا', minLen: 6, maxLen: 6, placeholder: '312345' },
  { code: 'AO', dial: '+244', labelEn: 'Angola', labelAr: 'أنغولا', nameEn: 'Angola', nameAr: 'أنغولا', minLen: 9, maxLen: 9, placeholder: '923123456' },
  { code: 'AG', dial: '+1', labelEn: 'Antigua and Barbuda', labelAr: 'أنتيغوا وبربودا', nameEn: 'Antigua and Barbuda', nameAr: 'أنتيغوا وبربودا', minLen: 10, maxLen: 10, placeholder: '2681234567' },
  { code: 'AR', dial: '+54', labelEn: 'Argentina', labelAr: 'الأرجنتين', nameEn: 'Argentina', nameAr: 'الأرجنتين', minLen: 10, maxLen: 10, placeholder: '9111234567' },
  { code: 'AM', dial: '+374', labelEn: 'Armenia', labelAr: 'أرمينيا', nameEn: 'Armenia', nameAr: 'أرمينيا', minLen: 8, maxLen: 8, placeholder: '77123456' },
  { code: 'AU', dial: '+61', labelEn: 'Australia', labelAr: 'أستراليا', nameEn: 'Australia', nameAr: 'أستراليا', minLen: 9, maxLen: 9, placeholder: '412345678' },
  { code: 'AT', dial: '+43', labelEn: 'Austria', labelAr: 'النمسا', nameEn: 'Austria', nameAr: 'النمسا', minLen: 10, maxLen: 10, placeholder: '6641234567' },
  { code: 'AZ', dial: '+994', labelEn: 'Azerbaijan', labelAr: 'أذربيجان', nameEn: 'Azerbaijan', nameAr: 'أذربيجان', minLen: 9, maxLen: 9, placeholder: '501234567' },
  { code: 'BS', dial: '+1', labelEn: 'Bahamas', labelAr: 'جزر البهاما', nameEn: 'Bahamas', nameAr: 'جزر البهاما', minLen: 10, maxLen: 10, placeholder: '2421234567' },
  { code: 'BD', dial: '+880', labelEn: 'Bangladesh', labelAr: 'بنغلاديش', nameEn: 'Bangladesh', nameAr: 'بنغلاديش', minLen: 10, maxLen: 10, placeholder: '1712345678' },
  { code: 'BB', dial: '+1', labelEn: 'Barbados', labelAr: 'بربادوس', nameEn: 'Barbados', nameAr: 'بربادوس', minLen: 10, maxLen: 10, placeholder: '2461234567' },
  { code: 'BY', dial: '+375', labelEn: 'Belarus', labelAr: 'بيلاروسيا', nameEn: 'Belarus', nameAr: 'بيلاروسيا', minLen: 9, maxLen: 9, placeholder: '291234567' },
  { code: 'BE', dial: '+32', labelEn: 'Belgium', labelAr: 'بلجيكا', nameEn: 'Belgium', nameAr: 'بلجيكا', minLen: 9, maxLen: 9, placeholder: '470123456' },
  { code: 'BZ', dial: '+501', labelEn: 'Belize', labelAr: 'بليز', nameEn: 'Belize', nameAr: 'بليز', minLen: 7, maxLen: 7, placeholder: '6123456' },
  { code: 'BJ', dial: '+229', labelEn: 'Benin', labelAr: 'بنين', nameEn: 'Benin', nameAr: 'بنين', minLen: 8, maxLen: 8, placeholder: '90123456' },
  { code: 'BT', dial: '+975', labelEn: 'Bhutan', labelAr: 'بوتان', nameEn: 'Bhutan', nameAr: 'بوتان', minLen: 8, maxLen: 8, placeholder: '17123456' },
  { code: 'BO', dial: '+591', labelEn: 'Bolivia', labelAr: 'بوليفيا', nameEn: 'Bolivia', nameAr: 'بوليفيا', minLen: 8, maxLen: 8, placeholder: '71234567' },
  { code: 'BA', dial: '+387', labelEn: 'Bosnia and Herzegovina', labelAr: 'البوسنة والهرسك', nameEn: 'Bosnia and Herzegovina', nameAr: 'البوسنة والهرسك', minLen: 8, maxLen: 8, placeholder: '61123456' },
  { code: 'BW', dial: '+267', labelEn: 'Botswana', labelAr: 'بوتسوانا', nameEn: 'Botswana', nameAr: 'بوتسوانا', minLen: 8, maxLen: 8, placeholder: '71123456' },
  { code: 'BR', dial: '+55', labelEn: 'Brazil', labelAr: 'البرازيل', nameEn: 'Brazil', nameAr: 'البرازيل', minLen: 10, maxLen: 11, placeholder: '11912345678' },
  { code: 'BN', dial: '+673', labelEn: 'Brunei', labelAr: 'بروناي', nameEn: 'Brunei', nameAr: 'بروناي', minLen: 7, maxLen: 7, placeholder: '8123456' },
  { code: 'BG', dial: '+359', labelEn: 'Bulgaria', labelAr: 'بلغاريا', nameEn: 'Bulgaria', nameAr: 'بلغاريا', minLen: 8, maxLen: 9, placeholder: '87123456' },
  { code: 'BF', dial: '+226', labelEn: 'Burkina Faso', labelAr: 'بوركينا فاسو', nameEn: 'Burkina Faso', nameAr: 'بوركينا فاسو', minLen: 8, maxLen: 8, placeholder: '70123456' },
  { code: 'BI', dial: '+257', labelEn: 'Burundi', labelAr: 'بوروندي', nameEn: 'Burundi', nameAr: 'بوروندي', minLen: 8, maxLen: 8, placeholder: '79123456' },
  { code: 'CV', dial: '+238', labelEn: 'Cabo Verde', labelAr: 'الرأس الأخضر', nameEn: 'Cabo Verde', nameAr: 'الرأس الأخضر', minLen: 7, maxLen: 7, placeholder: '9912345' },
  { code: 'KH', dial: '+855', labelEn: 'Cambodia', labelAr: 'كمبوديا', nameEn: 'Cambodia', nameAr: 'كمبوديا', minLen: 8, maxLen: 9, placeholder: '12123456' },
  { code: 'CM', dial: '+237', labelEn: 'Cameroon', labelAr: 'الكاميرون', nameEn: 'Cameroon', nameAr: 'الكاميرون', minLen: 9, maxLen: 9, placeholder: '671234567' },
  { code: 'CA', dial: '+1', labelEn: 'Canada', labelAr: 'كندا', nameEn: 'Canada', nameAr: 'كندا', minLen: 10, maxLen: 10, placeholder: '5551234567' },
  { code: 'CF', dial: '+236', labelEn: 'Central African Republic', labelAr: 'جمهورية أفريقيا الوسطى', nameEn: 'Central African Republic', nameAr: 'جمهورية أفريقيا الوسطى', minLen: 8, maxLen: 8, placeholder: '75123456' },
  { code: 'TD', dial: '+235', labelEn: 'Chad', labelAr: 'تشاد', nameEn: 'Chad', nameAr: 'تشاد', minLen: 8, maxLen: 8, placeholder: '66123456' },
  { code: 'CL', dial: '+56', labelEn: 'Chile', labelAr: 'تشيلي', nameEn: 'Chile', nameAr: 'تشيلي', minLen: 9, maxLen: 9, placeholder: '912345678' },
  { code: 'CN', dial: '+86', labelEn: 'China', labelAr: 'الصين', nameEn: 'China', nameAr: 'الصين', minLen: 11, maxLen: 11, placeholder: '13812345678' },
  { code: 'CO', dial: '+57', labelEn: 'Colombia', labelAr: 'كولومبيا', nameEn: 'Colombia', nameAr: 'كولومبيا', minLen: 10, maxLen: 10, placeholder: '3001234567' },
  { code: 'KM', dial: '+269', labelEn: 'Comoros', labelAr: 'جزر القمر', nameEn: 'Comoros', nameAr: 'جزر القمر', minLen: 7, maxLen: 7, placeholder: '3212345' },
  { code: 'CD', dial: '+243', labelEn: 'Congo, Dem. Rep.', labelAr: 'جمهورية الكونغو الديمقراطية', nameEn: 'Congo, Dem. Rep.', nameAr: 'جمهورية الكونغو الديمقراطية', minLen: 9, maxLen: 9, placeholder: '811234567' },
  { code: 'CG', dial: '+242', labelEn: 'Congo, Republic of the', labelAr: 'جمهورية الكونغو', nameEn: 'Congo, Republic of the', nameAr: 'جمهورية الكونغو', minLen: 9, maxLen: 9, placeholder: '061234567' },
  { code: 'CR', dial: '+506', labelEn: 'Costa Rica', labelAr: 'كوستاريكا', nameEn: 'Costa Rica', nameAr: 'كوستاريكا', minLen: 8, maxLen: 8, placeholder: '83123456' },
  { code: 'HR', dial: '+385', labelEn: 'Croatia', labelAr: 'كرواتيا', nameEn: 'Croatia', nameAr: 'كرواتيا', minLen: 9, maxLen: 9, placeholder: '911234567' },
  { code: 'CU', dial: '+53', labelEn: 'Cuba', labelAr: 'كوبا', nameEn: 'Cuba', nameAr: 'كوبا', minLen: 8, maxLen: 8, placeholder: '52123456' },
  { code: 'CY', dial: '+357', labelEn: 'Cyprus', labelAr: 'قبرص', nameEn: 'Cyprus', nameAr: 'قبرص', minLen: 8, maxLen: 8, placeholder: '99123456' },
  { code: 'CZ', dial: '+420', labelEn: 'Czech Republic', labelAr: 'التشيك', nameEn: 'Czech Republic', nameAr: 'التشيك', minLen: 9, maxLen: 9, placeholder: '601123456' },
  { code: 'DK', dial: '+45', labelEn: 'Denmark', labelAr: 'الدنمارك', nameEn: 'Denmark', nameAr: 'الدنمارك', minLen: 8, maxLen: 8, placeholder: '20123456' },
  { code: 'DJ', dial: '+253', labelEn: 'Djibouti', labelAr: 'جيبوتي', nameEn: 'Djibouti', nameAr: 'جيبوتي', minLen: 8, maxLen: 8, placeholder: '77123456' },
  { code: 'DM', dial: '+1', labelEn: 'Dominica', labelAr: 'دومينيكا', nameEn: 'Dominica', nameAr: 'دومينيكا', minLen: 10, maxLen: 10, placeholder: '7671234567' },
  { code: 'DO', dial: '+1', labelEn: 'Dominican Republic', labelAr: 'جمهورية الدومينيكان', nameEn: 'Dominican Republic', nameAr: 'جمهورية الدومينيكان', minLen: 10, maxLen: 10, placeholder: '8091234567' },
  { code: 'TL', dial: '+670', labelEn: 'East Timor', labelAr: 'تيمور الشرقية', nameEn: 'East Timor', nameAr: 'تيمور الشرقية', minLen: 8, maxLen: 8, placeholder: '77123456' },
  { code: 'EC', dial: '+593', labelEn: 'Ecuador', labelAr: 'الإكوادور', nameEn: 'Ecuador', nameAr: 'الإكوادور', minLen: 9, maxLen: 9, placeholder: '991234567' },
  { code: 'SV', dial: '+503', labelEn: 'El Salvador', labelAr: 'السلفادور', nameEn: 'El Salvador', nameAr: 'السلفادور', minLen: 8, maxLen: 8, placeholder: '70123456' },
  { code: 'GQ', dial: '+240', labelEn: 'Equatorial Guinea', labelAr: 'غينيا الاستوائية', nameEn: 'Equatorial Guinea', nameAr: 'غينيا الاستوائية', minLen: 9, maxLen: 9, placeholder: '222123456' },
  { code: 'ER', dial: '+291', labelEn: 'Eritrea', labelAr: 'إريتريا', nameEn: 'Eritrea', nameAr: 'إريتريا', minLen: 7, maxLen: 7, placeholder: '7123456' },
  { code: 'EE', dial: '+372', labelEn: 'Estonia', labelAr: 'إستونيا', nameEn: 'Estonia', nameAr: 'إستونيا', minLen: 7, maxLen: 8, placeholder: '5123456' },
  { code: 'SZ', dial: '+268', labelEn: 'Eswatini', labelAr: 'إسواتيني', nameEn: 'Eswatini', nameAr: 'إسواتيني', minLen: 8, maxLen: 8, placeholder: '76123456' },
  { code: 'ET', dial: '+251', labelEn: 'Ethiopia', labelAr: 'إثيوبيا', nameEn: 'Ethiopia', nameAr: 'إثيوبيا', minLen: 9, maxLen: 9, placeholder: '911234567' },
  { code: 'FJ', dial: '+679', labelEn: 'Fiji', labelAr: 'فيجي', nameEn: 'Fiji', nameAr: 'فيجي', minLen: 7, maxLen: 7, placeholder: '7012345' },
  { code: 'FI', dial: '+358', labelEn: 'Finland', labelAr: 'فنلندا', nameEn: 'Finland', nameAr: 'فنلندا', minLen: 5, maxLen: 12, placeholder: '401234567' },
  { code: 'FR', dial: '+33', labelEn: 'France', labelAr: 'فرنسا', nameEn: 'France', nameAr: 'فرنسا', minLen: 9, maxLen: 9, placeholder: '612345678' },
  { code: 'GA', dial: '+241', labelEn: 'Gabon', labelAr: 'الغابون', nameEn: 'Gabon', nameAr: 'الغابون', minLen: 8, maxLen: 8, placeholder: '06123456' },
  { code: 'GM', dial: '+220', labelEn: 'Gambia', labelAr: 'غامبيا', nameEn: 'Gambia', nameAr: 'غامبيا', minLen: 7, maxLen: 7, placeholder: '7012345' },
  { code: 'GE', dial: '+995', labelEn: 'Georgia', labelAr: 'جورجيا', nameEn: 'Georgia', nameAr: 'جورجيا', minLen: 9, maxLen: 9, placeholder: '591234567' },
  { code: 'DE', dial: '+49', labelEn: 'Germany', labelAr: 'ألمانيا', nameEn: 'Germany', nameAr: 'ألمانيا', minLen: 10, maxLen: 11, placeholder: '15112345678' },
  { code: 'GH', dial: '+233', labelEn: 'Ghana', labelAr: 'غانا', nameEn: 'Ghana', nameAr: 'غانا', minLen: 9, maxLen: 9, placeholder: '241234567' },
  { code: 'GR', dial: '+30', labelEn: 'Greece', labelAr: 'اليونان', nameEn: 'Greece', nameAr: 'اليونان', minLen: 10, maxLen: 10, placeholder: '6912345678' },
  { code: 'GD', dial: '+1', labelEn: 'Grenada', labelAr: 'غرينادا', nameEn: 'Grenada', nameAr: 'غرينادا', minLen: 10, maxLen: 10, placeholder: '4731234567' },
  { code: 'GT', dial: '+502', labelEn: 'Guatemala', labelAr: 'غواتيمالا', nameEn: 'Guatemala', nameAr: 'غواتيمالا', minLen: 8, maxLen: 8, placeholder: '51234567' },
  { code: 'GN', dial: '+224', labelEn: 'Guinea', labelAr: 'غينيا', nameEn: 'Guinea', nameAr: 'غينيا', minLen: 9, maxLen: 9, placeholder: '621234567' },
  { code: 'GW', dial: '+245', labelEn: 'Guinea-Bissau', labelAr: 'غينيا بيساو', nameEn: 'Guinea-Bissau', nameAr: 'غينيا بيساو', minLen: 7, maxLen: 7, placeholder: '9512345' },
  { code: 'GY', dial: '+592', labelEn: 'Guyana', labelAr: 'غيانا', nameEn: 'Guyana', nameAr: 'غيانا', minLen: 7, maxLen: 7, placeholder: '6012345' },
  { code: 'HT', dial: '+509', labelEn: 'Haiti', labelAr: 'هايتي', nameEn: 'Haiti', nameAr: 'هايتي', minLen: 8, maxLen: 8, placeholder: '34123456' },
  { code: 'HN', dial: '+504', labelEn: 'Honduras', labelAr: 'هندوراس', nameEn: 'Honduras', nameAr: 'هندوراس', minLen: 8, maxLen: 8, placeholder: '91234567' },
  { code: 'HU', dial: '+36', labelEn: 'Hungary', labelAr: 'المجر', nameEn: 'Hungary', nameAr: 'المجر', minLen: 9, maxLen: 9, placeholder: '201234567' },
  { code: 'IS', dial: '+354', labelEn: 'Iceland', labelAr: 'آيسلندا', nameEn: 'Iceland', nameAr: 'آيسلندا', minLen: 7, maxLen: 7, placeholder: '6123456' },
  { code: 'IN', dial: '+91', labelEn: 'India', labelAr: 'الهند', nameEn: 'India', nameAr: 'الهند', minLen: 10, maxLen: 10, placeholder: '9876543210' },
  { code: 'ID', dial: '+62', labelEn: 'Indonesia', labelAr: 'إندونيسيا', nameEn: 'Indonesia', nameAr: 'إندونيسيا', minLen: 9, maxLen: 12, placeholder: '8123456789' },
  { code: 'IR', dial: '+98', labelEn: 'Iran', labelAr: 'إيران', nameEn: 'Iran', nameAr: 'إيران', minLen: 10, maxLen: 10, placeholder: '9123456789' },
  { code: 'IE', dial: '+353', labelEn: 'Ireland', labelAr: 'أيرلندا', nameEn: 'Ireland', nameAr: 'أيرلندا', minLen: 9, maxLen: 9, placeholder: '851234567' },
  { code: 'IL', dial: '+972', labelEn: 'Israel', labelAr: 'إسرائيل', nameEn: 'Israel', nameAr: 'إسرائيل', minLen: 9, maxLen: 9, placeholder: '501234567' },
  { code: 'IT', dial: '+39', labelEn: 'Italy', labelAr: 'إيطاليا', nameEn: 'Italy', nameAr: 'إيطاليا', minLen: 9, maxLen: 10, placeholder: '3123456789' },
  { code: 'CI', dial: '+225', labelEn: 'Ivory Coast', labelAr: 'ساحل العاج', nameEn: 'Ivory Coast', nameAr: 'ساحل العاج', minLen: 10, maxLen: 10, placeholder: '0712345678' },
  { code: 'JM', dial: '+1', labelEn: 'Jamaica', labelAr: 'جامايكا', nameEn: 'Jamaica', nameAr: 'جامايكا', minLen: 10, maxLen: 10, placeholder: '8761234567' },
  { code: 'JP', dial: '+81', labelEn: 'Japan', labelAr: 'اليابان', nameEn: 'Japan', nameAr: 'اليابان', minLen: 10, maxLen: 10, placeholder: '9012345678' },
  { code: 'KZ', dial: '+7', labelEn: 'Kazakhstan', labelAr: 'كازاخستان', nameEn: 'Kazakhstan', nameAr: 'كازاخستان', minLen: 10, maxLen: 10, placeholder: '7011234567' },
  { code: 'KE', dial: '+254', labelEn: 'Kenya', labelAr: 'كينيا', nameEn: 'Kenya', nameAr: 'كينيا', minLen: 9, maxLen: 9, placeholder: '712345678' },
  { code: 'KI', dial: '+686', labelEn: 'Kiribati', labelAr: 'كيريباتي', nameEn: 'Kiribati', nameAr: 'كيريباتي', minLen: 5, maxLen: 5, placeholder: '72123' },
  { code: 'KG', dial: '+996', labelEn: 'Kyrgyzstan', labelAr: 'قيرغيزستان', nameEn: 'Kyrgyzstan', nameAr: 'قيرغيزستان', minLen: 9, maxLen: 9, placeholder: '700123456' },
  { code: 'LA', dial: '+856', labelEn: 'Laos', labelAr: 'لاوس', nameEn: 'Laos', nameAr: 'لاوس', minLen: 8, maxLen: 10, placeholder: '2012345678' },
  { code: 'LV', dial: '+371', labelEn: 'Latvia', labelAr: 'لاتفيا', nameEn: 'Latvia', nameAr: 'لاتفيا', minLen: 8, maxLen: 8, placeholder: '21234567' },
  { code: 'LS', dial: '+266', labelEn: 'Lesotho', labelAr: 'ليسوتو', nameEn: 'Lesotho', nameAr: 'ليسوتو', minLen: 8, maxLen: 8, placeholder: '58123456' },
  { code: 'LR', dial: '+231', labelEn: 'Liberia', labelAr: 'ليبيريا', nameEn: 'Liberia', nameAr: 'ليبيريا', minLen: 9, maxLen: 9, placeholder: '771234567' },
  { code: 'LI', dial: '+423', labelEn: 'Liechtenstein', labelAr: 'ليختنشتاين', nameEn: 'Liechtenstein', nameAr: 'ليختنشتاين', minLen: 7, maxLen: 9, placeholder: '7912345' },
  { code: 'LT', dial: '+370', labelEn: 'Lithuania', labelAr: 'ليتوانيا', nameEn: 'Lithuania', nameAr: 'ليتوانيا', minLen: 8, maxLen: 8, placeholder: '61234567' },
  { code: 'LU', dial: '+352', labelEn: 'Luxembourg', labelAr: 'لوكسمبورغ', nameEn: 'Luxembourg', nameAr: 'لوكسمبورغ', minLen: 9, maxLen: 9, placeholder: '621123456' },
  { code: 'MG', dial: '+261', labelEn: 'Madagascar', labelAr: 'مدغشقر', nameEn: 'Madagascar', nameAr: 'مدغشقر', minLen: 9, maxLen: 9, placeholder: '321234567' },
  { code: 'MW', dial: '+265', labelEn: 'Malawi', labelAr: 'مالاوي', nameEn: 'Malawi', nameAr: 'مالاوي', minLen: 9, maxLen: 9, placeholder: '991234567' },
  { code: 'MY', dial: '+60', labelEn: 'Malaysia', labelAr: 'ماليزيا', nameEn: 'Malaysia', nameAr: 'ماليزيا', minLen: 9, maxLen: 10, placeholder: '123456789' },
  { code: 'MV', dial: '+960', labelEn: 'Maldives', labelAr: 'المالديف', nameEn: 'Maldives', nameAr: 'المالديف', minLen: 7, maxLen: 7, placeholder: '7912345' },
  { code: 'ML', dial: '+223', labelEn: 'Mali', labelAr: 'مالي', nameEn: 'Mali', nameAr: 'مالي', minLen: 8, maxLen: 8, placeholder: '65123456' },
  { code: 'MT', dial: '+356', labelEn: 'Malta', labelAr: 'مالطا', nameEn: 'Malta', nameAr: 'مالطا', minLen: 8, maxLen: 8, placeholder: '99123456' },
  { code: 'MH', dial: '+692', labelEn: 'Marshall Islands', labelAr: 'جزر مارشال', nameEn: 'Marshall Islands', nameAr: 'جزر مارشال', minLen: 7, maxLen: 7, placeholder: '2351234' },
  { code: 'MR', dial: '+222', labelEn: 'Mauritania', labelAr: 'موريتانيا', nameEn: 'Mauritania', nameAr: 'موريتانيا', minLen: 8, maxLen: 8, placeholder: '46123456' },
  { code: 'MU', dial: '+230', labelEn: 'Mauritius', labelAr: 'موريشيوس', nameEn: 'Mauritius', nameAr: 'موريشيوس', minLen: 8, maxLen: 8, placeholder: '52512345' },
  { code: 'MX', dial: '+52', labelEn: 'Mexico', labelAr: 'المكسيك', nameEn: 'Mexico', nameAr: 'المكسيك', minLen: 10, maxLen: 10, placeholder: '5512345678' },
  { code: 'FM', dial: '+691', labelEn: 'Micronesia', labelAr: 'ميكرونيزيا', nameEn: 'Micronesia', nameAr: 'ميكرونيزيا', minLen: 7, maxLen: 7, placeholder: '9201234' },
  { code: 'MD', dial: '+373', labelEn: 'Moldova', labelAr: 'مولدوفا', nameEn: 'Moldova', nameAr: 'مولدوفا', minLen: 8, maxLen: 8, placeholder: '69123456' },
  { code: 'MC', dial: '+377', labelEn: 'Monaco', labelAr: 'موناكو', nameEn: 'Monaco', nameAr: 'موناكو', minLen: 8, maxLen: 8, placeholder: '61234567' },
  { code: 'MN', dial: '+976', labelEn: 'Mongolia', labelAr: 'منغوليا', nameEn: 'Mongolia', nameAr: 'منغوليا', minLen: 8, maxLen: 8, placeholder: '88123456' },
  { code: 'ME', dial: '+382', labelEn: 'Montenegro', labelAr: 'الجبل الأسود', nameEn: 'Montenegro', nameAr: 'الجبل الأسود', minLen: 8, maxLen: 8, placeholder: '67123456' },
  { code: 'MZ', dial: '+258', labelEn: 'Mozambique', labelAr: 'موزمبيق', nameEn: 'Mozambique', nameAr: 'موزمبيق', minLen: 9, maxLen: 9, placeholder: '841234567' },
  { code: 'MM', dial: '+95', labelEn: 'Myanmar', labelAr: 'ميانمار', nameEn: 'Myanmar', nameAr: 'ميانمار', minLen: 9, maxLen: 9, placeholder: '912345678' },
  { code: 'NA', dial: '+264', labelEn: 'Namibia', labelAr: 'ناميبيا', nameEn: 'Namibia', nameAr: 'ناميبيا', minLen: 9, maxLen: 9, placeholder: '811234567' },
  { code: 'NR', dial: '+674', labelEn: 'Nauru', labelAr: 'ناورو', nameEn: 'Nauru', nameAr: 'ناورو', minLen: 7, maxLen: 7, placeholder: '5551234' },
  { code: 'NP', dial: '+977', labelEn: 'Nepal', labelAr: 'نيبال', nameEn: 'Nepal', nameAr: 'نيبال', minLen: 10, maxLen: 10, placeholder: '9841234567' },
  { code: 'NL', dial: '+31', labelEn: 'Netherlands', labelAr: 'هولندا', nameEn: 'Netherlands', nameAr: 'هولندا', minLen: 9, maxLen: 9, placeholder: '612345678' },
  { code: 'NZ', dial: '+64', labelEn: 'New Zealand', labelAr: 'نيوزيلندا', nameEn: 'New Zealand', nameAr: 'نيوزيلندا', minLen: 8, maxLen: 9, placeholder: '21123456' },
  { code: 'NI', dial: '+505', labelEn: 'Nicaragua', labelAr: 'نيكاراغوا', nameEn: 'Nicaragua', nameAr: 'نيكاراغوا', minLen: 8, maxLen: 8, placeholder: '81234567' },
  { code: 'NE', dial: '+227', labelEn: 'Niger', labelAr: 'النيجر', nameEn: 'Niger', nameAr: 'النيجر', minLen: 8, maxLen: 8, placeholder: '96123456' },
  { code: 'NG', dial: '+234', labelEn: 'Nigeria', labelAr: 'نيجيريا', nameEn: 'Nigeria', nameAr: 'نيجيريا', minLen: 10, maxLen: 10, placeholder: '8021234567' },
  { code: 'KP', dial: '+850', labelEn: 'North Korea', labelAr: 'كوريا الشمالية', nameEn: 'North Korea', nameAr: 'كوريا الشمالية', minLen: 8, maxLen: 10, placeholder: '1912345678' },
  { code: 'MK', dial: '+389', labelEn: 'North Macedonia', labelAr: 'مقدونيا الشمالية', nameEn: 'North Macedonia', nameAr: 'مقدونيا الشمالية', minLen: 8, maxLen: 8, placeholder: '70123456' },
  { code: 'NO', dial: '+47', labelEn: 'Norway', labelAr: 'النرويج', nameEn: 'Norway', nameAr: 'النرويج', minLen: 8, maxLen: 8, placeholder: '41234567' },
  { code: 'PK', dial: '+92', labelEn: 'Pakistan', labelAr: 'باكستان', nameEn: 'Pakistan', nameAr: 'باكستان', minLen: 10, maxLen: 10, placeholder: '3001234567' },
  { code: 'PW', dial: '+680', labelEn: 'Palau', labelAr: 'بالاو', nameEn: 'Palau', nameAr: 'بالاو', minLen: 7, maxLen: 7, placeholder: '7751234' },
  { code: 'PA', dial: '+507', labelEn: 'Panama', labelAr: 'بنما', nameEn: 'Panama', nameAr: 'بنما', minLen: 8, maxLen: 8, placeholder: '61234567' },
  { code: 'PG', dial: '+675', labelEn: 'Papua New Guinea', labelAr: 'بابوا غينيا الجديدة', nameEn: 'Papua New Guinea', nameAr: 'بابوا غينيا الجديدة', minLen: 8, maxLen: 8, placeholder: '70123456' },
  { code: 'PY', dial: '+595', labelEn: 'Paraguay', labelAr: 'باراغواي', nameEn: 'Paraguay', nameAr: 'باراغواي', minLen: 9, maxLen: 9, placeholder: '981123456' },
  { code: 'PE', dial: '+51', labelEn: 'Peru', labelAr: 'بيرو', nameEn: 'Peru', nameAr: 'بيرو', minLen: 9, maxLen: 9, placeholder: '912345678' },
  { code: 'PH', dial: '+63', labelEn: 'Philippines', labelAr: 'الفلبين', nameEn: 'Philippines', nameAr: 'الفلبين', minLen: 10, maxLen: 10, placeholder: '9171234567' },
  { code: 'PL', dial: '+48', labelEn: 'Poland', labelAr: 'بولندا', nameEn: 'Poland', nameAr: 'بولندا', minLen: 9, maxLen: 9, placeholder: '512345678' },
  { code: 'PT', dial: '+351', labelEn: 'Portugal', labelAr: 'البرتغال', nameEn: 'Portugal', nameAr: 'البرتغال', minLen: 9, maxLen: 9, placeholder: '912345678' },
  { code: 'RO', dial: '+40', labelEn: 'Romania', labelAr: 'رومانيا', nameEn: 'Romania', nameAr: 'رومانيا', minLen: 9, maxLen: 9, placeholder: '712345678' },
  { code: 'RU', dial: '+7', labelEn: 'Russia', labelAr: 'روسيا', nameEn: 'Russia', nameAr: 'روسيا', minLen: 10, maxLen: 10, placeholder: '9123456789' },
  { code: 'RW', dial: '+250', labelEn: 'Rwanda', labelAr: 'رواندا', nameEn: 'Rwanda', nameAr: 'رواندا', minLen: 9, maxLen: 9, placeholder: '781234567' },
  { code: 'KN', dial: '+1', labelEn: 'Saint Kitts and Nevis', labelAr: 'سانت كيتس ونيفيس', nameEn: 'Saint Kitts and Nevis', nameAr: 'سانت كيتس ونيفيس', minLen: 10, maxLen: 10, placeholder: '8691234567' },
  { code: 'LC', dial: '+1', labelEn: 'Saint Lucia', labelAr: 'سانت لوسيا', nameEn: 'Saint Lucia', nameAr: 'سانت لوسيا', minLen: 10, maxLen: 10, placeholder: '7581234567' },
  { code: 'VC', dial: '+1', labelEn: 'Saint Vincent', labelAr: 'سانت فنسنت والغرينادين', nameEn: 'Saint Vincent', nameAr: 'سانت فنسنت والغرينادين', minLen: 10, maxLen: 10, placeholder: '7841234567' },
  { code: 'WS', dial: '+685', labelEn: 'Samoa', labelAr: 'ساموا', nameEn: 'Samoa', nameAr: 'ساموا', minLen: 7, maxLen: 7, placeholder: '7212345' },
  { code: 'SM', dial: '+378', labelEn: 'San Marino', labelAr: 'سان مارينو', nameEn: 'San Marino', nameAr: 'سان مارينو', minLen: 6, maxLen: 10, placeholder: '66123456' },
  { code: 'ST', dial: '+239', labelEn: 'Sao Tome and Principe', labelAr: 'ساو تومي وبرينسيبي', nameEn: 'Sao Tome and Principe', nameAr: 'ساو تومي وبرينسيبي', minLen: 7, maxLen: 7, placeholder: '9912345' },
  { code: 'SN', dial: '+221', labelEn: 'Senegal', labelAr: 'السنغال', nameEn: 'Senegal', nameAr: 'السنغال', minLen: 9, maxLen: 9, placeholder: '771234567' },
  { code: 'RS', dial: '+381', labelEn: 'Serbia', labelAr: 'صربيا', nameEn: 'Serbia', nameAr: 'صربيا', minLen: 9, maxLen: 9, placeholder: '601234567' },
  { code: 'SC', dial: '+248', labelEn: 'Seychelles', labelAr: 'سيشل', nameEn: 'Seychelles', nameAr: 'سيشل', minLen: 7, maxLen: 7, placeholder: '2512345' },
  { code: 'SL', dial: '+232', labelEn: 'Sierra Leone', labelAr: 'سيراليون', nameEn: 'Sierra Leone', nameAr: 'سيراليون', minLen: 8, maxLen: 8, placeholder: '76123456' },
  { code: 'SG', dial: '+65', labelEn: 'Singapore', labelAr: 'سنغافورة', nameEn: 'Singapore', nameAr: 'سنغافورة', minLen: 8, maxLen: 8, placeholder: '81234567' },
  { code: 'SK', dial: '+421', labelEn: 'Slovakia', labelAr: 'سلوفاكيا', nameEn: 'Slovakia', nameAr: 'سلوفاكيا', minLen: 9, maxLen: 9, placeholder: '901123456' },
  { code: 'SI', dial: '+386', labelEn: 'Slovenia', labelAr: 'سلوفينيا', nameEn: 'Slovenia', nameAr: 'سلوفينيا', minLen: 8, maxLen: 8, placeholder: '41123456' },
  { code: 'SB', dial: '+677', labelEn: 'Solomon Islands', labelAr: 'جزر سليمان', nameEn: 'Solomon Islands', nameAr: 'جزر سليمان', minLen: 7, maxLen: 7, placeholder: '7412345' },
  { code: 'SO', dial: '+252', labelEn: 'Somalia', labelAr: 'الصومال', nameEn: 'Somalia', nameAr: 'الصومال', minLen: 8, maxLen: 8, placeholder: '61123456' },
  { code: 'ZA', dial: '+27', labelEn: 'South Africa', labelAr: 'جنوب أفريقيا', nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', minLen: 9, maxLen: 9, placeholder: '711234567' },
  { code: 'KR', dial: '+82', labelEn: 'South Korea', labelAr: 'كوريا الجنوبية', nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', minLen: 9, maxLen: 10, placeholder: '1012345678' },
  { code: 'SS', dial: '+211', labelEn: 'South Sudan', labelAr: 'جنوب السودان', nameEn: 'South Sudan', nameAr: 'جنوب السودان', minLen: 9, maxLen: 9, placeholder: '971234567' },
  { code: 'ES', dial: '+34', labelEn: 'Spain', labelAr: 'إسبانيا', nameEn: 'Spain', nameAr: 'إسبانيا', minLen: 9, maxLen: 9, placeholder: '612345678' },
  { code: 'LK', dial: '+94', labelEn: 'Sri Lanka', labelAr: 'سريلانكا', nameEn: 'Sri Lanka', nameAr: 'سريلانكا', minLen: 9, maxLen: 9, placeholder: '711234567' },
  { code: 'SR', dial: '+597', labelEn: 'Suriname', labelAr: 'سورينام', nameEn: 'Suriname', nameAr: 'سورينام', minLen: 7, maxLen: 7, placeholder: '7412345' },
  { code: 'SE', dial: '+46', labelEn: 'Sweden', labelAr: 'السويد', nameEn: 'Sweden', nameAr: 'السويد', minLen: 9, maxLen: 9, placeholder: '701234567' },
  { code: 'CH', dial: '+41', labelEn: 'Switzerland', labelAr: 'سويسرا', nameEn: 'Switzerland', nameAr: 'سويسرا', minLen: 9, maxLen: 9, placeholder: '781234567' },
  { code: 'TW', dial: '+886', labelEn: 'Taiwan', labelAr: 'تايوان', nameEn: 'Taiwan', nameAr: 'تايوان', minLen: 9, maxLen: 9, placeholder: '912345678' },
  { code: 'TJ', dial: '+992', labelEn: 'Tajikistan', labelAr: 'طاجيكستان', nameEn: 'Tajikistan', nameAr: 'طاجيكستان', minLen: 9, maxLen: 9, placeholder: '918123456' },
  { code: 'TZ', dial: '+255', labelEn: 'Tanzania', labelAr: 'تنزانيا', nameEn: 'Tanzania', nameAr: 'تنزانيا', minLen: 9, maxLen: 9, placeholder: '712345678' },
  { code: 'TH', dial: '+66', labelEn: 'Thailand', labelAr: 'تايلاند', nameEn: 'Thailand', nameAr: 'تايلاند', minLen: 9, maxLen: 9, placeholder: '812345678' },
  { code: 'TG', dial: '+228', labelEn: 'Togo', labelAr: 'توغو', nameEn: 'Togo', nameAr: 'توغو', minLen: 8, maxLen: 8, placeholder: '90123456' },
  { code: 'TO', dial: '+676', labelEn: 'Tonga', labelAr: 'تونغا', nameEn: 'Tonga', nameAr: 'تونغا', minLen: 5, maxLen: 5, placeholder: '77123' },
  { code: 'TT', dial: '+1', labelEn: 'Trinidad and Tobago', labelAr: 'ترينيداد وتوباغو', nameEn: 'Trinidad and Tobago', nameAr: 'ترينيداد وتوباغو', minLen: 10, maxLen: 10, placeholder: '8681234567' },
  { code: 'TR', dial: '+90', labelEn: 'Turkey', labelAr: 'تركيا', nameEn: 'Turkey', nameAr: 'تركيا', minLen: 10, maxLen: 10, placeholder: '5321234567' },
  { code: 'TM', dial: '+993', labelEn: 'Turkmenistan', labelAr: 'تركمانستان', nameEn: 'Turkmenistan', nameAr: 'تركمانستان', minLen: 8, maxLen: 8, placeholder: '65123456' },
  { code: 'TV', dial: '+688', labelEn: 'Tuvalu', labelAr: 'توفالو', nameEn: 'Tuvalu', nameAr: 'توفالو', minLen: 5, maxLen: 5, placeholder: '90123' },
  { code: 'UG', dial: '+256', labelEn: 'Uganda', labelAr: 'أوغندا', nameEn: 'Uganda', nameAr: 'أوغندا', minLen: 9, maxLen: 9, placeholder: '772123456' },
  { code: 'UA', dial: '+380', labelEn: 'Ukraine', labelAr: 'أوكرانيا', nameEn: 'Ukraine', nameAr: 'أوكرانيا', minLen: 9, maxLen: 9, placeholder: '501234567' },
  { code: 'GB', dial: '+44', labelEn: 'United Kingdom', labelAr: 'المملكة المتحدة', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', minLen: 10, maxLen: 10, placeholder: '7911123456' },
  { code: 'US', dial: '+1', labelEn: 'United States', labelAr: 'الولايات المتحدة', nameEn: 'United States', nameAr: 'الولايات المتحدة', minLen: 10, maxLen: 10, placeholder: '2025550143' },
  { code: 'UY', dial: '+598', labelEn: 'Uruguay', labelAr: 'أوروغواي', nameEn: 'Uruguay', nameAr: 'أوروغواي', minLen: 8, maxLen: 8, placeholder: '99123456' },
  { code: 'UZ', dial: '+998', labelEn: 'Uzbekistan', labelAr: 'أوزبكستان', nameEn: 'Uzbekistan', nameAr: 'أوزبكستان', minLen: 9, maxLen: 9, placeholder: '901234567' },
  { code: 'VU', dial: '+678', labelEn: 'Vanuatu', labelAr: 'فانواتو', nameEn: 'Vanuatu', nameAr: 'فانواتو', minLen: 7, maxLen: 7, placeholder: '5512345' },
  { code: 'VA', dial: '+379', labelEn: 'Vatican City', labelAr: 'الفاتيكان', nameEn: 'Vatican City', nameAr: 'الفاتيكان', minLen: 10, maxLen: 10, placeholder: '0669812345' },
  { code: 'VE', dial: '+58', labelEn: 'Venezuela', labelAr: 'فنزويلا', nameEn: 'Venezuela', nameAr: 'فنزويلا', minLen: 10, maxLen: 10, placeholder: '4121234567' },
  { code: 'VN', dial: '+84', labelEn: 'Vietnam', labelAr: 'فيتنام', nameEn: 'Vietnam', nameAr: 'فيتنام', minLen: 9, maxLen: 10, placeholder: '912345678' },
  { code: 'ZM', dial: '+260', labelEn: 'Zambia', labelAr: 'زامبيا', nameEn: 'Zambia', nameAr: 'زامبيا', minLen: 9, maxLen: 9, placeholder: '971234567' },
  { code: 'ZW', dial: '+263', labelEn: 'Zimbabwe', labelAr: 'زيمبابوي', nameEn: 'Zimbabwe', nameAr: 'زيمبابوي', minLen: 9, maxLen: 9, placeholder: '771234567' }
];

const CountriesHelper = {
  getCountryByDial(dial) {
    return COUNTRIES_DATA.find(c => c.dial === dial) || COUNTRIES_DATA[0];
  },

  getCountryByCode(code) {
    return COUNTRIES_DATA.find(c => c.code.toUpperCase() === code.toUpperCase()) || COUNTRIES_DATA[0];
  },

  cleanPhoneNumber(country, rawNumber) {
    if (!rawNumber) return '';
    let digits = rawNumber.toString().replace(/\D/g, '');
    if (!digits) return '';

    // Strip leading international exit code '00'
    if (digits.startsWith('00')) {
      digits = digits.substring(2);
    }

    // Strip country dial code if user entered it (e.g. 97471040746 -> 71040746)
    if (country && country.dial) {
      const dialDigits = country.dial.replace(/\D/g, '');
      if (digits.startsWith(dialDigits) && digits.length > country.maxLen) {
        digits = digits.substring(dialDigits.length);
      }
    }

    // Truncate strictly to country.maxLen
    if (country && digits.length > country.maxLen) {
      digits = digits.slice(0, country.maxLen);
    }

    return digits;
  },

  validatePhoneNumber(country, rawNumber) {
    if (!country) return false;
    const digits = this.cleanPhoneNumber(country, rawNumber);
    if (!digits) return false;

    // Check exact local length range (e.g., 8 for Qatar, 10 for Egypt, 10-11 for Brazil, 5-12 for Finland)
    return digits.length >= country.minLen && digits.length <= country.maxLen;
  },

  getValidationHint(country, lang = 'en') {
    if (!country) return '';
    const name = lang === 'ar' ? country.nameAr : country.nameEn;
    if (country.minLen === country.maxLen) {
      return lang === 'ar'
        ? `${name} (${country.dial}): يتكون من ${country.minLen} أرقام.`
        : `${name} (${country.dial}): Must be ${country.minLen} digits.`;
    } else {
      return lang === 'ar'
        ? `${name} (${country.dial}): يتكون من ${country.minLen} إلى ${country.maxLen} أرقام.`
        : `${name} (${country.dial}): Between ${country.minLen} and ${country.maxLen} digits.`;
    }
  },

  getSortedCountries(lang = 'en') {
    const list = [...COUNTRIES_DATA];
    if (lang === 'ar') {
      return list.sort((a, b) => {
        const textA = (a.labelAr || a.nameAr || '').trim();
        const textB = (b.labelAr || b.nameAr || '').trim();
        return textA.localeCompare(textB, 'ar', { sensitivity: 'base' });
      });
    }
    return list.sort((a, b) => {
      const textA = (a.labelEn || a.nameEn || '').trim();
      const textB = (b.labelEn || b.nameEn || '').trim();
      return textA.localeCompare(textB, 'en', { sensitivity: 'base' });
    });
  },

  renderDialSelects() {
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    const sortedCountries = this.getSortedCountries(lang);
    
    document.querySelectorAll('.country-code-select').forEach(select => {
      const currentVal = select.value || '+974';
      select.innerHTML = sortedCountries.map(c => {
        const countryLabel = lang === 'ar' ? (c.labelAr || c.nameAr) : (c.labelEn || c.nameEn);
        return `<option value="${c.dial}" data-code="${c.code}" ${c.dial === currentVal ? 'selected' : ''}>${countryLabel} ${c.dial}</option>`;
      }).join('');
      select.value = currentVal;
    });

    document.querySelectorAll('.country-select-dropdown').forEach(select => {
      const currentVal = select.value || 'QA';
      select.innerHTML = sortedCountries.map(c => {
        const name = lang === 'ar' ? c.nameAr : c.nameEn;
        return `<option value="${c.code}" data-dial="${c.dial}" ${c.code === currentVal ? 'selected' : ''}>${name}</option>`;
      }).join('');
      select.value = currentVal;
    });

    this.refreshAllPhoneInputs();
  },

  refreshAllPhoneInputs() {
    document.querySelectorAll('.phone-input-group').forEach(group => {
      const dialSelect = group.querySelector('.country-code-select');
      const input = group.querySelector('.phone-number-field, input[type="tel"]');
      const wrap = group.querySelector('.phone-input-wrap');
      if (!input || !dialSelect) return;

      const country = this.getCountryByDial(dialSelect.value);
      if (country) {
        input.placeholder = '';
        input.setAttribute('maxlength', country.maxLen);
        let digits = input.value.replace(/\D/g, '');
        if (digits.length > country.maxLen) {
          input.value = digits.slice(0, country.maxLen);
        }
      }

      if (wrap) {
        if (this.validatePhoneNumber(country, input.value)) {
          wrap.classList.add('is-valid');
        } else {
          wrap.classList.remove('is-valid');
        }
      }
    });
  },

  init() {
    this.renderDialSelects();

    // Auto-sync country selection to dial code & update validation rule
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('country-select-dropdown')) {
        const selectedCode = e.target.value;
        const country = this.getCountryByCode(selectedCode);
        if (country) {
          const form = e.target.closest('form');
          if (form) {
            const dialSelect = form.querySelector('.country-code-select');
            if (dialSelect) {
              dialSelect.value = country.dial;
            }
            const phoneInput = form.querySelector('.phone-number-field, input[type="tel"]');
            const wrap = form.querySelector('.phone-input-wrap');
            if (phoneInput) {
              phoneInput.placeholder = '';
              phoneInput.setAttribute('maxlength', country.maxLen);
              let digits = phoneInput.value.replace(/\D/g, '');
              if (digits.length > country.maxLen) {
                phoneInput.value = digits.slice(0, country.maxLen);
              }
              if (wrap) {
                if (this.validatePhoneNumber(country, phoneInput.value)) {
                  wrap.classList.add('is-valid');
                } else {
                  wrap.classList.remove('is-valid');
                }
              }
            }
          }
        }
      } else if (e.target.classList.contains('country-code-select')) {
        const group = e.target.closest('.phone-input-group');
        if (group) {
          const country = this.getCountryByDial(e.target.value);
          const phoneInput = group.querySelector('.phone-number-field, input[type="tel"]');
          const wrap = group.querySelector('.phone-input-wrap');
          if (phoneInput && country) {
            phoneInput.placeholder = '';
            phoneInput.setAttribute('maxlength', country.maxLen);
            let digits = phoneInput.value.replace(/\D/g, '');
            if (digits.length > country.maxLen) {
              phoneInput.value = digits.slice(0, country.maxLen);
            }
            if (wrap) {
              if (this.validatePhoneNumber(country, phoneInput.value)) {
                wrap.classList.add('is-valid');
              } else {
                wrap.classList.remove('is-valid');
              }
            }
          }
        }
      }
    });

    window.addEventListener('diamond:languageChanged', () => {
      this.renderDialSelects();
    });

    this.setupPhoneValidation();
  },

  setupPhoneValidation() {
    const checkmarkSvg = `<span class="phone-valid-checkmark" title="Phone verified">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>`;

    const checkWrap = (input) => {
      const wrap = input.closest('.phone-input-wrap');
      const group = input.closest('.phone-input-group');
      if (!wrap) return;

      if (!wrap.querySelector('.phone-valid-checkmark')) {
        wrap.insertAdjacentHTML('beforeend', checkmarkSvg);
      }

      const dialSelect = group ? group.querySelector('.country-code-select') : document.getElementById('checkout-phone-dial');
      const dial = dialSelect ? dialSelect.value : '+974';
      const country = CountriesHelper.getCountryByDial(dial);

      if (CountriesHelper.validatePhoneNumber(country, input.value)) {
        wrap.classList.add('is-valid');
      } else {
        wrap.classList.remove('is-valid');
      }
    };

    document.querySelectorAll('.phone-input-wrap').forEach(wrap => {
      if (!wrap.querySelector('.phone-valid-checkmark')) {
        wrap.insertAdjacentHTML('beforeend', checkmarkSvg);
      }
      const input = wrap.querySelector('input[type="tel"], .phone-number-field');
      if (input) checkWrap(input);
    });

    // Enforce only digits and maximum country.maxLen length strictly on input
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('phone-number-field') || e.target.type === 'tel') {
        const input = e.target;
        const group = input.closest('.phone-input-group');
        const dialSelect = group ? group.querySelector('.country-code-select') : document.getElementById('checkout-phone-dial');
        const dial = dialSelect ? dialSelect.value : '+974';
        const country = CountriesHelper.getCountryByDial(dial);

        let digits = input.value.replace(/\D/g, '');
        if (country && digits.length > country.maxLen) {
          digits = digits.slice(0, country.maxLen);
        }
        if (input.value !== digits) {
          input.value = digits;
        }
        checkWrap(input);
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('phone-number-field') || e.target.type === 'tel') {
        checkWrap(e.target);
      }
    });
  }
};

const App = {
  init() {
    this.injectSharedModals();
    this.setupNavbarScroll();
    this.setupMobileMenu();
    this.setupSearchModal();
    this.setupWishlistDrawer();
    this.setupQuickViewModal();
    this.setupWhatsAppWidget();
    this.setupNewsletter();
    this.setupContactForm();
    this.initHomeFeatured();

    // Background task scheduling for heavy background data
    const deferInit = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    deferInit(() => {
      CountriesHelper.init();
      this.setupScrollAnimations();
    });
  },

  setupNavbarScroll() {
    const navbar = document.querySelector('.diamond-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }, { passive: true });
  },

  setupMobileMenu() {
    const hamburger = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileClose = document.querySelector('.btn-close-mobile-nav');

    if (hamburger && mobileDrawer) {
      const openMobileMenu = () => {
        mobileDrawer.classList.add('is-open');
        if (mobileOverlay) mobileOverlay.classList.add('is-open');
        document.body.classList.add('mobile-nav-open');
      };

      const closeMobileMenu = () => {
        mobileDrawer.classList.remove('is-open');
        if (mobileOverlay) mobileOverlay.classList.remove('is-open');
        document.body.classList.remove('mobile-nav-open');
      };

      hamburger.addEventListener('click', openMobileMenu);
      if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
      if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    }
  },

  setupSearchModal() {
    const searchModal = document.getElementById('diamond-search-modal');
    const searchInput = document.getElementById('global-search-input');
    const searchClose = document.querySelector('.btn-close-search');

    const openSearch = () => {
      if (!searchModal) return;
      const mobileDrawer = document.querySelector('.mobile-nav-drawer');
      const mobileOverlay = document.querySelector('.mobile-nav-overlay');
      if (mobileDrawer) mobileDrawer.classList.remove('is-open');
      if (mobileOverlay) mobileOverlay.classList.remove('is-open');
      document.body.classList.remove('mobile-nav-open');

      searchModal.classList.add('is-open');
      document.body.classList.add('modal-open');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
        this.renderSearchResults(searchInput.value || '');
      }
    };

    const closeSearch = () => {
      if (!searchModal) return;
      searchModal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    };

    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-search-trigger')) {
        e.preventDefault();
        openSearch();
      }
      if (e.target.closest('.btn-close-search') || (searchModal && e.target === searchModal)) {
        closeSearch();
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('is-open')) {
        closeSearch();
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderSearchResults(e.target.value);
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = searchInput.value.trim();
          if (val) {
            window.location.href = `shop.html?search=${encodeURIComponent(val)}`;
          }
        }
      });
    }
  },

  renderSearchResults(query) {
    const resultsContainer = document.getElementById('global-search-results');
    if (!resultsContainer) return;

    const lang = I18n.getLang();
    const cleanQ = (query || '').trim();
    const isInitial = cleanQ === '';
    
    // When initial/empty, show top 5 featured/popular devices as suggestions
    const products = isInitial 
      ? ProductService.getFeatured().slice(0, 5)
      : ProductService.search(cleanQ, lang);

    if (products.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p>${I18n.t('searchNoResults')}</p>
        </div>
      `;
      return;
    }

    const headerText = isInitial
      ? (lang === 'ar' ? 'الأجهزة الأكثر طلباً وتميزاً' : 'Popular & Featured Devices')
      : (lang === 'ar' ? `نتائج البحث (${products.length})` : `Search Results (${products.length})`);

    const viewAllLink = !isInitial ? `
      <a href="shop.html?search=${encodeURIComponent(cleanQ)}" class="search-view-all-link">
        <span>${lang === 'ar' ? 'عرض الكل في المتجر ←' : 'View all in shop →'}</span>
      </a>
    ` : '';

    const listHtml = products.map(p => {
      const name = p.name[lang] || p.name.en;
      const tagline = p.tagline[lang] || p.tagline.en;
      const brandName = (typeof I18n !== 'undefined') ? I18n.getBrandName(p.brand, lang) : p.brand;
      return `
        <a href="product.html?id=${p.id}" class="search-result-item">
          <div class="search-item-img">
            <img src="${p.images[0]}" alt="${name}" loading="lazy" decoding="async" width="80" height="80" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
          </div>
          <div class="search-item-details">
            <div class="search-item-brand">${brandName}</div>
            <div class="search-item-title">${name}</div>
            <div class="search-item-tagline">${tagline}</div>
          </div>
          <div class="search-item-pricing">
            <span class="search-item-price">${(typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(p.basePrice, lang) : (p.basePrice.toLocaleString() + ' QR')}</span>
          </div>
        </a>
      `;
    }).join('');

    resultsContainer.innerHTML = `
      <div class="search-results-header-row">
        <div class="search-section-header">${headerText}</div>
        ${viewAllLink}
      </div>
      <div class="search-items-wrapper">
        ${listHtml}
      </div>
    `;
  },

  setupWishlistDrawer() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-wishlist-nav-trigger')) {
        e.preventDefault();
        this.openWishlistDrawer();
      }
      if (e.target.closest('.btn-close-wishlist') || e.target.id === 'wishlist-drawer-overlay') {
        this.closeWishlistDrawer();
      }
    });

    window.addEventListener('diamond:wishlistUpdated', () => {
      this.renderWishlistDrawer();
    });
  },

  renderWishlistDrawer() {
    const container = document.getElementById('wishlist-drawer-items');
    const emptyEl = document.getElementById('wishlist-drawer-empty');
    const footerEl = document.getElementById('wishlist-drawer-footer');
    if (!container) return;

    const wishlistIds = Cart.getWishlist();
    const lang = I18n.getLang();

    if (wishlistIds.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    const products = wishlistIds.map(id => ProductService.getById(id)).filter(Boolean);

    container.innerHTML = products.map(p => {
      const name = p.name[lang] || p.name.en;
      const brandName = (typeof I18n !== 'undefined') ? I18n.getBrandName(p.brand, lang) : p.brand;
      const formattedPrice = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(p.basePrice, lang) : (p.basePrice.toLocaleString() + ' QR');
      return `
        <div class="cart-drawer-item">
          <div class="cart-drawer-img">
            <img src="${p.images[0]}" alt="${name}" loading="lazy" decoding="async" width="80" height="80" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
          </div>
          <div class="cart-drawer-info">
            <div class="cart-drawer-brand">${brandName}</div>
            <h4 class="cart-drawer-title"><a href="product.html?id=${p.id}">${name}</a></h4>
            <div class="cart-drawer-price">${formattedPrice}</div>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 8px; padding: 6px 12px; font-size: 0.78rem;" onclick="Cart.addItem('${p.id}', 1); Cart.toggleWishlist('${p.id}');">
              ${I18n.t('addToCart')}
            </button>
          </div>
          <button type="button" class="cart-drawer-remove" onclick="Cart.toggleWishlist('${p.id}')" title="Remove from Wishlist">
            &times;
          </button>
        </div>
      `;
    }).join('');
  },

  openWishlistDrawer() {
    const drawer = document.getElementById('wishlist-drawer');
    const overlay = document.getElementById('wishlist-drawer-overlay');
    if (drawer && overlay) {
      this.renderWishlistDrawer();
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('drawer-open');
    }
  },

  closeWishlistDrawer() {
    const drawer = document.getElementById('wishlist-drawer');
    const overlay = document.getElementById('wishlist-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
    }
  },

  setupQuickViewModal() {
    document.addEventListener('click', (e) => {
      const qvBtn = e.target.closest('.btn-quick-view');
      if (qvBtn) {
        e.preventDefault();
        const productId = qvBtn.getAttribute('data-product-id');
        this.openQuickView(productId);
      }
    });
  },

  openQuickView(productId) {
    const product = ProductService.getById(productId);
    if (!product) return;

    const lang = I18n.getLang();
    const name = product.name[lang] || product.name.en;
    const desc = product.description[lang] || product.description.en;
    const brandName = (typeof I18n !== 'undefined') ? I18n.getBrandName(product.brand, lang) : product.brand;
    const modal = document.getElementById('diamond-quickview-modal');
    const content = document.getElementById('quickview-content');

    if (!modal || !content) return;

    const colorsHtml = product.colors.map((c, i) => `
      <label class="color-option ${i === 0 ? 'active' : ''}">
        <input type="radio" name="qv-color" value="${c.code}" ${i === 0 ? 'checked' : ''}>
        <span class="color-swatch" style="background-color: ${c.hex}" title="${c.name[lang] || c.name.en}"></span>
      </label>
    `).join('');

    const storageHtml = product.storageOptions ? product.storageOptions.map((s, i) => `
      <label class="storage-option ${i === 0 ? 'active' : ''}">
        <input type="radio" name="qv-storage" value="${s.size}" data-multiplier="${s.priceMultiplier}" ${i === 0 ? 'checked' : ''}>
        <span class="storage-pill">${(typeof I18n !== 'undefined') ? I18n.formatStorage(s.size, lang) : s.size}</span>
      </label>
    `).join('') : '';

    content.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-gallery">
          <div class="quickview-main-image">
            <img id="qv-main-img" src="${product.images[0]}" alt="${name}" decoding="async" width="400" height="400" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'">
          </div>
          <div class="quickview-thumbs">
            ${product.images.map((img, i) => `
              <button type="button" class="qv-thumb ${i === 0 ? 'active' : ''}" onclick="document.getElementById('qv-main-img').src = '${img}'; document.querySelectorAll('.qv-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
                <img src="${img}" alt="${name}" loading="lazy" decoding="async" width="80" height="80" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="quickview-info">
          <div class="product-card-meta" style="margin-bottom: 8px;">
            <span class="product-brand" style="margin-bottom: 0;">${brandName}</span>
            <span class="product-condition-tag ${
              (product.condition || 'new') === 'new' ? 'badge-condition-new' :
              (product.condition || 'new') === 'like-new' ? 'badge-condition-likenew' : 'badge-condition-certified'
            }">
              ${
                (product.condition || 'new') === 'new' ? (lang === 'ar' ? 'جديد كلياً (كرتونة مغلقة)' : 'Brand New (Sealed Box)') :
                (product.condition || 'new') === 'like-new' ? (lang === 'ar' ? 'كالجديد (استعمال أقل من سنة)' : 'Like New (Used < 1 Year)') :
                (lang === 'ar' ? 'مستعمل (استعمال أقل من 3 سنوات)' : 'Pre-Owned (Used < 3 Years)')
              }
            </span>
          </div>
          <h2 class="quickview-title">${name}</h2>
          
          <div class="product-rating-row">
            <div class="rating-stars">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span class="rating-val">${product.rating}</span>
            <span class="reviews-count">(${product.reviewsCount} ${I18n.t('verifiedReviews')})</span>
          </div>

          <div class="quickview-price-row">
            <span class="quickview-price" id="qv-price-display">${(typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(product.basePrice, lang) : (product.basePrice.toLocaleString() + ' QR')}</span>
          </div>

          <p class="quickview-desc">${desc}</p>

          <div class="quickview-options">
            <div class="option-group">
              <label class="option-label">${I18n.t('selectColor')}</label>
              <div class="color-options-wrap">${colorsHtml}</div>
            </div>

            ${storageHtml ? `
              <div class="option-group">
                <label class="option-label">${I18n.t('selectStorage')}</label>
                <div class="storage-options-wrap">${storageHtml}</div>
              </div>
            ` : ''}

            <div class="option-group">
              <label class="option-label">${I18n.t('quantity')}</label>
              <div class="qty-selector">
                <button type="button" class="qty-btn" onclick="const q = document.getElementById('qv-qty'); if(+q.value > 1) q.value = +q.value - 1">-</button>
                <input type="number" id="qv-qty" value="1" min="1" max="10" readonly>
                <button type="button" class="qty-btn" onclick="const q = document.getElementById('qv-qty'); if(+q.value < 10) q.value = +q.value + 1">+</button>
              </div>
            </div>
          </div>

          <div class="quickview-actions">
            <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-qv-add-cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>${I18n.t('addToCart')}</span>
            </button>
            <a href="product.html?id=${product.id}" class="btn btn-outline btn-block">
              <span>${I18n.t('quickviewSpecsBtn')}</span>
            </a>
          </div>
        </div>
      </div>
    `;

    content.querySelectorAll('input[name="qv-storage"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const mult = parseFloat(e.target.dataset.multiplier) || 1.0;
        const newPrice = Math.round(product.basePrice * mult);
        const priceEl = document.getElementById('qv-price-display');
        if (priceEl) priceEl.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(newPrice, lang) : (`$${newPrice.toLocaleString()}`);
        content.querySelectorAll('.storage-option').forEach(o => o.classList.remove('active'));
        e.target.closest('.storage-option').classList.add('active');
      });
    });

    content.querySelectorAll('input[name="qv-color"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        content.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        e.target.closest('.color-option').classList.add('active');
      });
    });

    const addBtn = document.getElementById('btn-qv-add-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const selectedColorCode = content.querySelector('input[name="qv-color"]:checked')?.value;
        const selectedColor = product.colors.find(c => c.code === selectedColorCode) || product.colors[0];
        
        const selectedStorageSize = content.querySelector('input[name="qv-storage"]:checked')?.value;
        const selectedStorage = product.storageOptions ? product.storageOptions.find(s => s.size === selectedStorageSize) : null;

        const qty = parseInt(document.getElementById('qv-qty')?.value || 1, 10);

        Cart.addItem(product.id, qty, { color: selectedColor, storage: selectedStorage });
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
      });
    }

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  },

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    const attachReveals = () => {
      const candidates = document.querySelectorAll(`
        .section-header,
        .hero-device-card,
        .hero-stats-row,
        .product-card,
        .category-card,
        .perk-card,
        .tech-highlight-card,
        .testimonial-card,
        .boutique-story-card,
        .info-card,
        .faq-item,
        .reveal-on-scroll
      `);

      candidates.forEach((el, index) => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
        }
        if (!el.style.transitionDelay && (index % 4 !== 0)) {
          el.style.transitionDelay = `${(index % 4) * 75}ms`;
        }
        observer.observe(el);
      });
    };

    attachReveals();
    window.addEventListener('diamond:productsRendered', () => {
      setTimeout(attachReveals, 60);
    });
    window.addEventListener('diamond:languageChanged', () => {
      setTimeout(attachReveals, 60);
    });
  },

  setupNewsletter() {
    document.addEventListener('submit', (e) => {
      if (e.target.classList.contains('newsletter-form')) {
        e.preventDefault();
        const input = e.target.querySelector('input[type="email"]');
        if (input && input.value) {
          Toast.show(I18n.t('newsletterSuccess'), 'success');
          input.value = '';
        }
      }
    });
  },

  setupWhatsAppWidget() {
    const btn = document.getElementById('btn-whatsapp-floating');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = I18n.getLang() === 'ar'
          ? "مرحباً دايموند تك، أود الاستفسار عن الأجهزة والطلبات الفاخرة المتاحة لديكم."
          : "Hello Diamond Tech, I would like to inquire about your flagship tech devices.";
        const url = `https://wa.me/97471040746?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  },

  initHomeFeatured() {
    const container = document.getElementById('home-featured-products');
    if (!container) return;

    const render = () => {
      if (typeof ProductService === 'undefined' || typeof Shop === 'undefined') return;
      const featured = ProductService.getFeatured().slice(0, 4);
      const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
      container.innerHTML = featured.map(p => Shop.renderProductCard(p, lang)).join('');
    };

    render();
    window.addEventListener('diamond:languageChanged', render);
  },

  setupContactForm() {
    const form = document.getElementById('contact-inquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name') || '';
      const countryField = formData.get('country') || '';
      const email = formData.get('email') || '';
      const dial = formData.get('phoneDial') || '+974';
      const phoneNum = formData.get('phone') || '';
      const subject = formData.get('subject') || (I18n.getLang() === 'ar' ? 'استفسار طلب فاخر' : 'Luxury Tech Inquiry');
      const message = formData.get('message') || '';
      const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';

      // Check phone length
      const country = CountriesHelper.getCountryByDial(dial);
      if (country && phoneNum) {
        const digits = phoneNum.replace(/\D/g, '');
        if (digits.length < country.minLen || digits.length > country.maxLen) {
          Toast.show(CountriesHelper.getValidationHint(country, lang), 'error');
          const phoneInput = form.querySelector('input[name="phone"]');
          if (phoneInput) phoneInput.focus();
          return;
        }
      }

      const fullPhone = phoneNum ? `${dial} ${phoneNum.trim()}` : '';

      let emailBody = '';
      if (lang === 'ar') {
        emailBody = `مرحباً بفريق كونسيرج دايموند الفاخر،

يسعدني التواصل معكم وتقديم الاستفسار التالي:

────────────────────────────────────────
📋 بيانات العميل:
────────────────────────────────────────
• الاسم الكامل: ${name}
• الدولة: ${countryField || 'غير محدد'}
• البريد الإلكتروني: ${email}
• رقم الهاتف / واتساب: ${fullPhone || 'غير محدد'}
• موضوع الاستفسار: ${subject}

────────────────────────────────────────
💬 نص الرسالة والطلب:
────────────────────────────────────────
${message}

────────────────────────────────────────
مع خالص التحيات والتقدير،
${name}`;
      } else {
        emailBody = `Dear Diamond Concierge Team,

Welcome! I am contacting you through the Diamond Client Portal regarding the following Inquiry:

────────────────────────────────────────
CLIENT CONTACT DETAILS
────────────────────────────────────────
• Full Name: ${name}
• Country: ${countryField || 'N/A'}
• Email Address: ${email}
• Contact Phone / WhatsApp: ${fullPhone || 'Not provided'}
• Subject: ${subject}

────────────────────────────────────────
INQUIRY & REQUIREMENTS
────────────────────────────────────────
${message}

────────────────────────────────────────
Kind regards,
${name}`;
      }

      const emailTo = 'concierge@diamond-tech.luxury';
      const emailSubject = `[Client Inquiry] ${subject} - ${name}`;

      // Open in Outlook / Default Mail Client directly
      const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
    });
  },

  injectSharedModals() {
    if (!document.getElementById('diamond-shared-modals')) {
      const modalsDiv = document.createElement('div');
      modalsDiv.id = 'diamond-shared-modals';
      modalsDiv.innerHTML = `
        <!-- Global Search Modal -->
        <div id="diamond-search-modal" class="diamond-modal-container">
          <div class="modal-backdrop"></div>
          <div class="search-modal-card">
            <div class="search-modal-header">
              <div class="search-input-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input type="text" id="global-search-input" class="search-modal-input" placeholder="" autocomplete="off" aria-label="Search">
              <button type="button" class="btn-close-search" aria-label="Close search">&times;</button>
            </div>
            <div class="search-modal-body">
              <div id="global-search-results" class="search-results-list"></div>
            </div>
          </div>
        </div>

        <!-- Quick View Modal -->
        <div id="diamond-quickview-modal" class="diamond-modal-container">
          <div class="modal-backdrop"></div>
          <div class="quickview-modal-card">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="document.getElementById('diamond-quickview-modal').classList.remove('is-open'); document.body.classList.remove('modal-open');">&times;</button>
            <div id="quickview-content" class="quickview-modal-body"></div>
          </div>
        </div>

        <!-- Sign In Modal -->
        <div id="auth-signin-modal" class="diamond-modal-container auth-modal">
          <div class="modal-backdrop"></div>
          <div class="auth-modal-card">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="Auth.closeModals()">&times;</button>
            <div class="auth-card-header">
              <div class="auth-logo-symbol">✦</div>
              <h3 class="auth-title" data-i18n="authSignInTitle">${I18n.t('authSignInTitle')}</h3>
              <p class="auth-subtitle" data-i18n="authSignInSubtitle">${I18n.t('authSignInSubtitle')}</p>
            </div>
            <div id="signin-error" class="auth-error-alert" style="display:none;"></div>
            <form id="form-signin" class="auth-form">
              <div class="form-group">
                <label class="form-label" data-i18n="authEmail">${I18n.t('authEmail')}</label>
                <input type="email" name="email" class="form-input" placeholder="name@example.com" required>
              </div>
              <div class="form-group">
                <div class="label-row">
                  <label class="form-label" data-i18n="authPassword">${I18n.t('authPassword')}</label>
                  <button type="button" class="form-link-subtle" onclick="Auth.openForgotModal()" data-i18n="authForgotPassword">${I18n.t('authForgotPassword')}</button>
                </div>
                <input type="password" name="password" class="form-input" placeholder="••••••••" data-i18n-placeholder="authPasswordPlaceholder" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="authSignInBtn">${I18n.t('authSignInBtn')}</button>
            </form>
            <div class="auth-footer">
              <span data-i18n="authNoAccount">${I18n.t('authNoAccount')}</span>
              <button type="button" class="auth-switch-link" onclick="Auth.openSignUpModal()" data-i18n="authSignUpBtn">${I18n.t('authSignUpBtn')}</button>
            </div>
          </div>
        </div>

        <!-- Sign Up Modal -->
        <div id="auth-signup-modal" class="diamond-modal-container auth-modal">
          <div class="modal-backdrop"></div>
          <div class="auth-modal-card">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="Auth.closeModals()">&times;</button>
            <div class="auth-card-header">
              <div class="auth-logo-symbol">✦</div>
              <h3 class="auth-title" data-i18n="authSignUpTitle">${I18n.t('authSignUpTitle')}</h3>
              <p class="auth-subtitle" data-i18n="authSignUpSubtitle">${I18n.t('authSignUpSubtitle')}</p>
            </div>
            <div id="signup-error" class="auth-error-alert" style="display:none;"></div>
            <form id="form-signup" class="auth-form">
              <div class="form-group">
                <label class="form-label" data-i18n="authName">${I18n.t('authName')}</label>
                <input type="text" name="name" class="form-input" placeholder="Full Name" data-i18n-placeholder="authNamePlaceholder" required>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="authEmail">${I18n.t('authEmail')}</label>
                <input type="email" name="email" class="form-input" placeholder="name@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="authPassword">${I18n.t('authPassword')}</label>
                <input type="password" name="password" class="form-input" placeholder="••••••••" data-i18n-placeholder="authPasswordPlaceholder" required minlength="6">
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="authSignUpBtn">${I18n.t('authSignUpBtn')}</button>
            </form>
            <div class="auth-footer">
              <span data-i18n="authHaveAccount">${I18n.t('authHaveAccount')}</span>
              <button type="button" class="auth-switch-link" onclick="Auth.openSignInModal()" data-i18n="authSignInBtn">${I18n.t('authSignInBtn')}</button>
            </div>
          </div>
        </div>

        <!-- Forgot Password Modal -->
        <div id="auth-forgot-modal" class="diamond-modal-container auth-modal">
          <div class="modal-backdrop"></div>
          <div class="auth-modal-card">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="Auth.closeModals()">&times;</button>
            <div class="auth-card-header">
              <div class="auth-logo-symbol">✦</div>
              <h3 class="auth-title" data-i18n="authForgotTitle">${I18n.t('authForgotTitle')}</h3>
              <p class="auth-subtitle" data-i18n="authForgotDesc">${I18n.t('authForgotDesc')}</p>
            </div>
            <div id="forgot-error" class="auth-error-alert" style="display:none;"></div>
            
            <!-- Step 1: Request Code -->
            <form id="form-forgot-step1" class="auth-form">
              <div class="form-group">
                <label class="form-label" data-i18n="authEmail">${I18n.t('authEmail')}</label>
                <input type="email" id="forgot-email-input" class="form-input" placeholder="name@example.com" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="authSendCodeBtn">${I18n.t('authSendCodeBtn')}</button>
            </form>

            <!-- Step 2: Enter Code & New Password -->
            <form id="form-forgot-step2" class="auth-form" style="display:none;">
              <div class="form-group">
                <label class="form-label" data-i18n="authVerifyCode">${I18n.t('authVerifyCode')}</label>
                <input type="text" id="forgot-code-input" class="form-input" placeholder="6-digit code (e.g. 849201)" data-i18n-placeholder="authCodePlaceholder" maxlength="6" required style="letter-spacing: 0.2em; font-weight: 700; text-align: center;">
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="authNewPassword">${I18n.t('authNewPassword')}</label>
                <input type="password" id="forgot-newpass-input" class="form-input" placeholder="Enter new password" data-i18n-placeholder="authNewPassPlaceholder" minlength="6" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="authResetPasswordBtn">${I18n.t('authResetPasswordBtn')}</button>
            </form>

            <div class="auth-footer">
              <button type="button" class="auth-switch-link" onclick="Auth.openSignInModal()" data-i18n="authBackToSignIn">← ${I18n.t('authBackToSignIn')}</button>
            </div>
          </div>
        </div>

        <!-- Profile Settings Modal with Picture Upload -->
        <div id="profile-settings-modal" class="diamond-modal-container">
          <div class="modal-backdrop"></div>
          <div class="auth-modal-card" style="max-width: 480px;">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="Auth.closeModals()">&times;</button>
            <div class="auth-card-header">
              <h3 class="auth-title" data-i18n="profileTitle">${I18n.t('profileTitle')}</h3>
            </div>
            <form id="form-profile-settings" class="auth-form">
              <!-- Avatar Upload Area -->
              <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div id="profile-avatar-preview" class="profile-avatar-preview-box"></div>
                <label for="profile-avatar-file" class="btn btn-outline btn-sm" style="cursor: pointer;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  <span data-i18n="profileUploadBtn">${I18n.t('profileUploadBtn')}</span>
                </label>
                <input type="file" id="profile-avatar-file" accept="image/*" style="display:none;">
              </div>

              <div class="form-group">
                <label class="form-label" data-i18n="authName">${I18n.t('authName')}</label>
                <input type="text" id="profile-name-input" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="authEmail">${I18n.t('authEmail')}</label>
                <input type="email" id="profile-email-input" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="phoneNumber">${I18n.t('phoneNumber')}</label>
                <div class="phone-input-group">
                  <div class="country-code-select-wrap">
                    <select id="profile-phone-dial" class="country-code-select" aria-label="Country Code"></select>
                  </div>
                  <div class="phone-input-wrap">
                    <input type="tel" id="profile-phone-input" class="form-input phone-number-field" placeholder="">
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="profileSaveBtn">${I18n.t('profileSaveBtn')}</button>
            </form>
          </div>
        </div>

        <!-- My Orders Modal -->
        <div id="my-orders-modal" class="diamond-modal-container">
          <div class="modal-backdrop"></div>
          <div class="auth-modal-card" style="max-width: 600px; max-height: 85vh; overflow-y: auto;">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="Auth.closeModals()">&times;</button>
            <div class="auth-card-header">
              <h3 class="auth-title" data-i18n="ordersTitle">${I18n.t('ordersTitle')}</h3>
            </div>
            <div id="orders-list-container"></div>
          </div>
        </div>

        <!-- Saved Wishlist Drawer -->
        <div id="wishlist-drawer-overlay" class="cart-drawer-overlay"></div>
        <div id="wishlist-drawer" class="cart-drawer-panel">
          <div class="cart-drawer-header">
            <div class="drawer-title-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <h3 data-i18n="wishlistTitle">${I18n.t('wishlistTitle')}</h3>
            </div>
            <button type="button" class="btn-close-wishlist modal-close-btn">&times;</button>
          </div>
          <div class="cart-drawer-body">
            <div id="wishlist-drawer-empty" class="cart-drawer-empty" style="display:none;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <p data-i18n="wishlistEmpty">${I18n.t('wishlistEmpty')}</p>
              <a href="shop.html" class="btn btn-outline btn-sm" style="margin-top: 14px;" data-i18n="cartContinueShopping">${I18n.t('cartContinueShopping')}</a>
            </div>
            <div id="wishlist-drawer-items" class="cart-drawer-items-list"></div>
          </div>
          <div id="wishlist-drawer-footer" class="cart-drawer-footer" style="display:none;">
            <a href="shop.html" class="btn btn-outline btn-block" data-i18n="viewAllProducts">${I18n.t('viewAllProducts')}</a>
          </div>
        </div>

        <!-- Quick Cart Drawer -->
        <div id="cart-drawer-overlay" class="cart-drawer-overlay"></div>
        <div id="cart-drawer" class="cart-drawer-panel">
          <div class="cart-drawer-header">
            <div class="drawer-title-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <h3 data-i18n="cartTitle">${I18n.t('cartTitle')}</h3>
            </div>
            <button type="button" class="btn-close-drawer modal-close-btn">&times;</button>
          </div>
          <div class="cart-drawer-body">
            <div id="cart-drawer-empty" class="cart-drawer-empty" style="display:none;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <h4 data-i18n="cartEmptyTitle">${I18n.t('cartEmptyTitle')}</h4>
              <p data-i18n="cartEmptyDesc">${I18n.t('cartEmptyDesc')}</p>
              <a href="shop.html" class="btn btn-outline btn-sm" data-i18n="cartContinueShopping">${I18n.t('cartContinueShopping')}</a>
            </div>
            <div id="cart-drawer-items" class="cart-drawer-items-list"></div>
          </div>
          <div id="cart-drawer-footer" class="cart-drawer-footer">
            <div class="drawer-subtotal-row">
              <span data-i18n="subtotal">${I18n.t('subtotal')}</span>
              <span id="cart-drawer-subtotal" class="drawer-subtotal-amount">0 QR</span>
            </div>
            <div class="drawer-footer-actions">
              <a href="cart.html" class="btn btn-primary btn-block btn-lg" data-i18n="proceedToCheckout">${I18n.t('proceedToCheckout')}</a>
            </div>
          </div>
        </div>

        <!-- Dynamic Website Notice Modal -->
        <div id="diamond-dynamic-notice-modal" class="diamond-modal-container">
          <div class="modal-backdrop" onclick="App.closeDynamicNotice()"></div>
          <div class="dynamic-notice-modal-card">
            <div class="dynamic-notice-icon">⚡</div>
            <h3 class="dynamic-notice-title" id="dynamic-notice-title-el" data-i18n="dynamicNoticeTitle">${I18n.t('dynamicNoticeTitle')}</h3>
            <p class="dynamic-notice-msg" id="dynamic-notice-msg-el" data-i18n="dynamicNoticeMsg">${I18n.t('dynamicNoticeMsg')}</p>
            <button type="button" class="btn btn-primary btn-block btn-lg btn-dynamic-notice-close" id="btn-dynamic-notice-ok" onclick="App.closeDynamicNotice()" data-i18n="dynamicNoticeOk">${I18n.t('dynamicNoticeOk')}</button>
          </div>
        </div>

        <!-- Luxury Share Product Modal -->
        <div id="diamond-share-modal" class="diamond-modal-container">
          <div class="modal-backdrop" onclick="App.closeShareModal()"></div>
          <div class="share-modal-card">
            <button type="button" class="modal-close-btn btn-close-modal" onclick="App.closeShareModal()">&times;</button>
            <div class="share-modal-header">
              <div class="share-icon-badge">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <div>
                <h3 class="share-modal-title" id="share-modal-title-el" data-i18n="shareTitle">${I18n.t('shareTitle')}</h3>
                <p class="share-modal-subtitle" id="share-modal-subtitle-el" data-i18n="shareSubtitle">${I18n.t('shareSubtitle')}</p>
              </div>
            </div>

            <div class="share-product-preview" id="share-product-preview">
              <img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80" id="share-preview-img" alt="Product" class="share-preview-img">
              <div class="share-preview-info">
                <div class="share-preview-brand" id="share-preview-brand">Diamond</div>
                <div class="share-preview-name" id="share-preview-name">Luxury Smartphone</div>
                <div class="share-preview-price" id="share-preview-price">3,999 QR</div>
              </div>
            </div>

            <!-- Social Share Channels Row (4 Main Apps + More) -->
            <div class="share-channels-grid">
              <a href="#" id="share-channel-whatsapp" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-whatsapp" title="WhatsApp">
                <div class="share-channel-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.032 2C6.505 2 2.025 6.48 2.025 12.008c0 1.954.563 3.778 1.541 5.321L2 22l4.832-1.528A9.957 9.957 0 0 0 12.032 22C17.56 22 22.04 17.52 22.04 12.008 22.04 6.48 17.56 2 12.032 2z"/></svg>
                </div>
                <span data-i18n="shareWhatsApp">${I18n.t('shareWhatsApp')}</span>
              </a>

              <a href="#" id="share-channel-telegram" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-telegram" title="Telegram">
                <div class="share-channel-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                </div>
                <span data-i18n="shareTelegram">${I18n.t('shareTelegram')}</span>
              </a>

              <a href="#" id="share-channel-twitter" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-twitter" title="X / Twitter">
                <div class="share-channel-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
                <span data-i18n="shareTwitter">${I18n.t('shareTwitter')}</span>
              </a>

              <a href="#" id="share-channel-facebook" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-facebook" title="Facebook">
                <div class="share-channel-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </div>
                <span data-i18n="shareFacebook">${I18n.t('shareFacebook')}</span>
              </a>

              <button type="button" id="btn-share-toggle-more" class="share-channel-btn share-btn-more" onclick="App.toggleMoreSharePlatforms()" title="More Platforms">
                <div class="share-channel-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
                </div>
                <span id="share-more-btn-label" data-i18n="shareMore">${I18n.t('shareMore')}</span>
              </button>
            </div>

            <!-- Expandable More Platforms Tray -->
            <div id="share-more-platforms-panel" class="share-more-platforms-panel" style="display: none;">
              <div class="share-more-header">
                <span data-i18n="shareMorePlatforms">${I18n.t('shareMorePlatforms')}</span>
              </div>
              <div class="share-more-grid">
                <a href="#" id="share-channel-email" class="share-channel-btn share-btn-email" title="Email">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span data-i18n="shareEmail">${I18n.t('shareEmail')}</span>
                </a>

                <a href="#" id="share-channel-linkedin" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-linkedin" title="LinkedIn">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  </div>
                  <span data-i18n="shareLinkedIn">${I18n.t('shareLinkedIn')}</span>
                </a>

                <a href="#" id="share-channel-reddit" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-reddit" title="Reddit">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.562 1.25 1.25 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.11a.57.57 0 0 0-.17.408c0 .314.254.57.57.57.086 0 .17-.02.247-.06 1.15-.623 2.6-.623 3.75 0a.569.569 0 0 0 .247.06.57.57 0 0 0 .57-.57.57.57 0 0 0-.17-.408c-1.39-1.02-3.654-1.02-5.044 0z"/></svg>
                  </div>
                  <span data-i18n="shareReddit">${I18n.t('shareReddit')}</span>
                </a>

                <a href="#" id="share-channel-pinterest" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-pinterest" title="Pinterest">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
                  </div>
                  <span data-i18n="sharePinterest">${I18n.t('sharePinterest')}</span>
                </a>

                <a href="#" id="share-channel-skype" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-btn-skype" title="Skype">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.6 0 5.6 1.4 3.5 3.5 1.4 5.6 0 8.6 0 12c0 2.2.6 4.3 1.7 6.1L.5 23.5l5.4-1.2C7.7 23.4 9.8 24 12 24c3.4 0 6.4-1.4 8.5-3.5 2.1-2.1 3.5-5.1 3.5-8.5 0-2.2-.6-4.3-1.7-6.1l1.2-5.4-5.4 1.2C16.3.6 14.2 0 12 0zm0 18.5c-3.6 0-5.8-1.8-5.8-3.7 0-1.1.8-1.8 1.9-1.8 2.2 0 1.6 3.1 3.9 3.1 1.2 0 2.1-.7 2.1-1.7 0-.9-.7-1.4-2.3-1.9l-1.9-.6C7.5 11.2 6.5 9.8 6.5 8c0-2.7 2.2-4.5 5.5-4.5 3.1 0 5.2 1.6 5.2 3.4 0 1-.8 1.6-1.7 1.6-1.9 0-1.5-2.6-3.5-2.6-1.1 0-1.8.6-1.8 1.4 0 .9.8 1.3 2.3 1.8l1.6.5c2.7.9 3.8 2.3 3.8 4.2 0 2.7-2.3 4.7-5.9 4.7z"/></svg>
                  </div>
                  <span data-i18n="shareSkype">${I18n.t('shareSkype')}</span>
                </a>

                <a href="#" id="share-channel-sms" class="share-channel-btn share-btn-sms" title="SMS Messages">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <span data-i18n="shareSMS">${I18n.t('shareSMS')}</span>
                </a>

                <button type="button" id="share-channel-native" class="share-channel-btn share-btn-native" onclick="App.triggerNativeShare()" title="Device Share">
                  <div class="share-channel-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                  </div>
                  <span data-i18n="shareNativeDevice">${I18n.t('shareNativeDevice')}</span>
                </button>
              </div>
            </div>

            <!-- Copy Link Bar -->
            <div class="share-copy-bar">
              <input type="text" id="share-copy-input" readonly class="share-copy-input" value="">
              <button type="button" class="btn btn-primary btn-copy-share-link" id="btn-copy-share-link" onclick="App.copyShareLink()">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span id="share-copy-btn-text" data-i18n="shareCopyLink">${I18n.t('shareCopyLink')}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Floating WhatsApp Widget -->
        <div class="diamond-whatsapp-widget" id="diamond-whatsapp">
          <button type="button" class="btn-whatsapp-floating" id="btn-whatsapp-floating" aria-label="WhatsApp Concierge">
            <span class="whatsapp-beacon"></span>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path fill="#ffffff" fill-rule="evenodd" clip-rule="evenodd" d="M18.403 5.638A8.955 8.955 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.2 4.488L3 21l4.646-1.218a8.946 8.946 0 0 0 4.405 1.15h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.629-6.317zm-6.35 13.812h-.003a7.446 7.446 0 0 1-3.799-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.976c.002-4.114 3.349-7.461 7.465-7.461a7.422 7.422 0 0 1 5.279 2.188 7.42 7.42 0 0 1 2.183 5.28c-.002 4.114-3.349 7.462-7.466 7.462zm4.095-5.591c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58 1.73-.711.88c-.131.15-.262.169-.487.056-.225-.113-.949-.35-1.808-1.115-.668-.596-1.12-1.332-1.251-1.557s-.014-.346.099-.458c.101-.1.225-.262.337-.393s.15-.225.225-.375c.075-.15.037-.281-.019-.394s-.504-1.216-.69-1.665c-.182-.437-.367-.378-.504-.385l-.43-.008c-.15 0-.393.056-.599.281-.206.225-.786.768-.786 1.872s.805 2.172.917 2.322c.112.15 1.583 2.417 3.835 3.39.536.231.954.369 1.28.473.538.171 1.028.147 1.415.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.066-.056-.093-.206-.15-.431-.262z"/>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(modalsDiv);
      if (typeof I18n !== 'undefined') {
        I18n.applyLanguage(I18n.getLang());
      }
    }
  },

  openShareModal(productId) {
    this.injectSharedModals();
    let product = null;
    if (productId && typeof ProductService !== 'undefined') {
      product = ProductService.getById(productId);
    }
    if (!product && typeof ProductDetail !== 'undefined' && ProductDetail.product) {
      product = ProductDetail.product;
    }
    if (!product && typeof ProductService !== 'undefined') {
      const all = ProductService.getAll();
      if (all && all.length > 0) product = all[0];
    }

    const modal = document.getElementById('diamond-share-modal');
    if (!modal) return;

    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    const prodName = product ? (typeof product.name === 'object' ? (product.name[lang] || product.name.en) : product.name) : 'Diamond Product';
    const prodBrand = product ? ((typeof I18n !== 'undefined') ? I18n.getBrandName(product.brand, lang) : product.brand) : 'Diamond';
    const prodPrice = product ? ((typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(product.basePrice, lang) : (`${product.basePrice} QR`)) : '';
    const prodImg = (product && product.images && product.images[0]) ? product.images[0] : 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80';

    // Construct full clean absolute URL
    let baseUrl = window.location.href.split('?')[0];
    if (!baseUrl.endsWith('product.html')) {
      baseUrl = baseUrl.replace(/[^/]*$/, '') + 'product.html';
    }
    const shareUrl = product ? `${baseUrl}?id=${encodeURIComponent(product.id)}` : window.location.href;
    const shareText = `${prodName} - ${prodPrice} | Diamond Luxury Tech`;

    // Populate Preview Elements
    const imgEl = document.getElementById('share-preview-img');
    const brandEl = document.getElementById('share-preview-brand');
    const nameEl = document.getElementById('share-preview-name');
    const priceEl = document.getElementById('share-preview-price');
    const inputEl = document.getElementById('share-copy-input');

    if (imgEl) {
      imgEl.src = prodImg;
      imgEl.alt = prodName;
    }
    if (brandEl) brandEl.textContent = prodBrand;
    if (nameEl) nameEl.textContent = prodName;
    if (priceEl) priceEl.textContent = prodPrice;
    if (inputEl) inputEl.value = shareUrl;

    // Reset copy button text
    const btnText = document.getElementById('share-copy-btn-text');
    if (btnText) btnText.textContent = (typeof I18n !== 'undefined') ? I18n.t('shareCopyLink') : 'Copy Link';

    // Direct Product Link for All Messaging Apps
    const waBtn = document.getElementById('share-channel-whatsapp');
    if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`;

    const tgBtn = document.getElementById('share-channel-telegram');
    if (tgBtn) tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`;

    const twBtn = document.getElementById('share-channel-twitter');
    if (twBtn) twBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;

    const fbBtn = document.getElementById('share-channel-facebook');
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    const mailBtn = document.getElementById('share-channel-email');
    if (mailBtn) mailBtn.href = `mailto:?subject=${encodeURIComponent(prodName)}&body=${encodeURIComponent(shareUrl)}`;

    const inBtn = document.getElementById('share-channel-linkedin');
    if (inBtn) inBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    const rdBtn = document.getElementById('share-channel-reddit');
    if (rdBtn) rdBtn.href = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(prodName)}`;

    const pinBtn = document.getElementById('share-channel-pinterest');
    if (pinBtn) pinBtn.href = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(prodImg)}&description=${encodeURIComponent(prodName)}`;

    const skBtn = document.getElementById('share-channel-skype');
    if (skBtn) skBtn.href = `https://web.skype.com/share?url=${encodeURIComponent(shareUrl)}`;

    const smsBtn = document.getElementById('share-channel-sms');
    if (smsBtn) smsBtn.href = `sms:?&body=${encodeURIComponent(shareUrl)}`;

    // Reset more panel visibility
    const morePanel = document.getElementById('share-more-platforms-panel');
    if (morePanel) morePanel.style.display = 'none';
    const moreBtn = document.getElementById('btn-share-toggle-more');
    if (moreBtn) moreBtn.classList.remove('is-active');

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
  },

  toggleMoreSharePlatforms() {
    const panel = document.getElementById('share-more-platforms-panel');
    const moreBtn = document.getElementById('btn-share-toggle-more');
    if (!panel) return;

    const isVisible = panel.style.display !== 'none';
    if (isVisible) {
      panel.style.display = 'none';
      if (moreBtn) moreBtn.classList.remove('is-active');
    } else {
      panel.style.display = 'block';
      if (moreBtn) moreBtn.classList.add('is-active');
    }
  },

  triggerNativeShare() {
    const inputEl = document.getElementById('share-copy-input');
    const url = (inputEl && inputEl.value) ? inputEl.value : window.location.href;
    const nameEl = document.getElementById('share-preview-name');
    const prodName = nameEl ? nameEl.textContent : 'Diamond Tech';

    if (navigator.share) {
      navigator.share({
        title: prodName,
        url: url
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          this.copyShareLink();
        }
      });
    } else {
      this.copyShareLink();
    }
  },

  closeShareModal() {
    const modal = document.getElementById('diamond-share-modal');
    if (modal) {
      modal.classList.remove('is-open');
    }
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
  },

  copyShareLink() {
    const inputEl = document.getElementById('share-copy-input');
    const url = (inputEl && inputEl.value) ? inputEl.value : window.location.href;

    const btnText = document.getElementById('share-copy-btn-text');
    const copyBtn = document.getElementById('btn-copy-share-link');
    const svgIcon = copyBtn ? copyBtn.querySelector('svg') : null;

    const onSuccess = () => {
      const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
      const copiedWord = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('shareCopied') : (lang === 'ar' ? 'تم النسخ!' : 'Copied!');
      const toastMsg = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('shareToastCopied') : (lang === 'ar' ? 'تم نسخ رابط المنتج إلى الحافظة!' : 'Product link copied to clipboard!');

      if (btnText) btnText.textContent = copiedWord;
      if (copyBtn) {
        copyBtn.classList.add('is-copied');
        copyBtn.style.background = '#059669';
        copyBtn.style.borderColor = '#059669';
        copyBtn.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.35)';
      }
      if (svgIcon) {
        svgIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        svgIcon.setAttribute('stroke', '#ffffff');
      }

      if (typeof Toast !== 'undefined') {
        Toast.show(toastMsg, 'success');
      }

      setTimeout(() => {
        if (btnText) btnText.textContent = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('shareCopyLink') : (lang === 'ar' ? 'نسخ الرابط' : 'Copy Link');
        if (copyBtn) {
          copyBtn.classList.remove('is-copied');
          copyBtn.style.background = '';
          copyBtn.style.borderColor = '';
          copyBtn.style.boxShadow = '';
        }
        if (svgIcon) {
          svgIcon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
        }
      }, 2500);
    };

    // Robust multi-layered copy method that works across all protocols (file://, http://, https://) and devices
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(onSuccess).catch(() => {
          this.fallbackCopyText(url, onSuccess);
        });
      } else {
        this.fallbackCopyText(url, onSuccess);
      }
    } catch (err) {
      this.fallbackCopyText(url, onSuccess);
    }
  },

  fallbackCopyText(text, callback) {
    // 1. Try selecting existing input
    const inputEl = document.getElementById('share-copy-input');
    if (inputEl) {
      inputEl.removeAttribute('readonly');
      inputEl.focus();
      inputEl.select();
      inputEl.setSelectionRange(0, 99999);
      try {
        const success = document.execCommand('copy');
        inputEl.setAttribute('readonly', 'readonly');
        if (success) {
          if (typeof callback === 'function') callback();
          return;
        }
      } catch (e) {
        inputEl.setAttribute('readonly', 'readonly');
      }
    }

    // 2. Fallback using temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
    } catch (e) {
      console.warn('execCommand copy fallback failed', e);
    }
    document.body.removeChild(textarea);
    if (typeof callback === 'function') callback();
  },

  showDynamicNotice(title, msg) {
    this.injectSharedModals();
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    const defaultTitle = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('dynamicNoticeTitle') : (lang === 'ar' ? 'إشعار توضيحي' : 'Dynamic Platform Notice');
    const defaultMsg = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('dynamicNoticeMsg') : (lang === 'ar' ? 'هذا الإجراء مخصص لموقع ويب ديناميكي' : 'This is for a dynamic website');
    
    const modal = document.getElementById('diamond-dynamic-notice-modal');
    if (!modal) return;
    
    const titleEl = document.getElementById('dynamic-notice-title-el');
    const msgEl = document.getElementById('dynamic-notice-msg-el');
    if (titleEl) titleEl.textContent = title || defaultTitle;
    if (msgEl) msgEl.textContent = msg || defaultMsg;
    
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
  },

  closeDynamicNotice() {
    const modal = document.getElementById('diamond-dynamic-notice-modal');
    if (modal) {
      modal.classList.remove('is-open');
    }
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
  }
};

// Global Fallback for any image load failure & Global Click Handlers
window.addEventListener('error', (e) => {
  if (e.target && e.target.tagName === 'IMG') {
    const fallbackSrc = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';
    if (e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  }
}, true);

document.addEventListener('click', (e) => {
  // Share Modal Trigger (Card button or Product Detail share button or generic data-action)
  const shareBtn = e.target.closest('.btn-card-share, .btn-product-share, #btn-product-detail-share, [data-action="share"]');
  if (shareBtn) {
    e.preventDefault();
    e.stopPropagation();
    const card = shareBtn.closest('.product-card');
    const productId = shareBtn.getAttribute('data-product-id') || (card ? card.getAttribute('data-id') : null);
    App.openShareModal(productId);
    return;
  }

  // Copy Share Link Button Interceptor
  const copyShareBtn = e.target.closest('#btn-copy-share-link, .btn-copy-share-link');
  if (copyShareBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.copyShareLink();
    return;
  }

  // More Share Platforms Toggle Interceptor
  const toggleMoreBtn = e.target.closest('#btn-share-toggle-more, .share-btn-more');
  if (toggleMoreBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.toggleMoreSharePlatforms();
    return;
  }

  // Native Share Sheet Trigger Interceptor
  const nativeShareBtn = e.target.closest('#share-channel-native, .share-btn-native');
  if (nativeShareBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.triggerNativeShare();
    return;
  }

  // Share Modal Dismiss Handlers
  const closeShareBtn = e.target.closest('.btn-close-share-modal, #diamond-share-modal .modal-close-btn');
  if (closeShareBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.closeShareModal();
    return;
  }

  const shareBackdrop = e.target.closest('#diamond-share-modal .modal-backdrop');
  if (shareBackdrop) {
    e.preventDefault();
    e.stopPropagation();
    App.closeShareModal();
    return;
  }

  // Dynamic Notice Dismiss Handlers (Understood Button & Backdrop)
  const closeNoticeBtn = e.target.closest('#btn-dynamic-notice-ok, .btn-dynamic-notice-close, [data-action="close-dynamic-notice"]');
  if (closeNoticeBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.closeDynamicNotice();
    return;
  }

  const noticeBackdrop = e.target.closest('#diamond-dynamic-notice-modal .modal-backdrop');
  if (noticeBackdrop) {
    e.preventDefault();
    e.stopPropagation();
    App.closeDynamicNotice();
    return;
  }

  // Card Add to Cart Click Interceptor
  const addCartBtn = e.target.closest('.btn-card-addcart, [data-action="add-to-cart"]');
  if (addCartBtn) {
    e.preventDefault();
    e.stopPropagation();
    const card = addCartBtn.closest('.product-card');
    const productId = addCartBtn.getAttribute('data-product-id') || (card ? card.getAttribute('data-id') : null);
    if (productId && typeof Cart !== 'undefined') {
      Cart.addItem(productId, 1);
    }
    return;
  }

  // Quick View Button Click Interceptor
  const qvBtn = e.target.closest('.btn-card-quickview, .btn-quick-view, [data-action="quickview"]');
  if (qvBtn) {
    e.preventDefault();
    e.stopPropagation();
    const card = qvBtn.closest('.product-card');
    const productId = qvBtn.getAttribute('data-product-id') || (card ? card.getAttribute('data-id') : null);
    if (productId) {
      App.openQuickView(productId);
    }
    return;
  }

  // Clear / Reset Filters Interceptor
  const resetFiltersBtn = e.target.closest('#btn-reset-empty-filters, .btn-reset-empty, #btn-clear-filters, .btn-clear-filters, [data-action="reset-filters"]');
  if (resetFiltersBtn) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof Shop !== 'undefined' && Shop.resetFilters) {
      Shop.resetFilters();
    }
    return;
  }

  // Whole Product Card Click Navigator
  const productCard = e.target.closest('.product-card');
  if (productCard) {
    // If clicking on any interactive button or control, ignore
    if (e.target.closest('button, input, select, textarea, [data-action]')) {
      return;
    }
    const productId = productCard.getAttribute('data-id') || productCard.getAttribute('data-product-id');
    if (productId) {
      window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
      return;
    }
  }

  // Buy Now Notice Click Interceptor
  const buyNowBtn = e.target.closest('.btn-buy-now, #btn-buy-now, [data-action="buynow"]');
  if (buyNowBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.showDynamicNotice();
    return;
  }
  
  // Sign In Notice Click Interceptor
  const signInBtn = e.target.closest('.btn-auth-signin, .btn-sign-in-trigger, #btn-open-signin, [data-action="signin"]');
  if (signInBtn) {
    e.preventDefault();
    e.stopPropagation();
    App.showDynamicNotice();
    return;
  }
});

window.App = App;

// Register Service Worker for PWA & Offline Support
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Diamond Service Worker active', reg.scope))
      .catch(err => console.log('Service Worker skipped', err));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
