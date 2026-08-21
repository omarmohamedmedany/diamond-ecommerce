/**
 * Diamond E-Commerce - Core Application Controller
 * Handles Navigation, Search Modal, Wishlist Drawer, WhatsApp Concierge, Country Selectors, and Shared Modals
 */

const COUNTRIES_DATA = [
  // Primary / GCC & Middle East
  { code: 'QA', dial: '+974', labelEn: 'Qatar', labelAr: 'قطر', nameEn: 'Qatar', nameAr: 'قطر', startDigits: ['3', '5', '6', '7'], minLen: 8, maxLen: 8, placeholder: '7104 0746' },
  { code: 'SA', dial: '+966', labelEn: 'Saudi', labelAr: 'السعودية', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', startDigits: ['5'], minLen: 9, maxLen: 9, placeholder: '50 123 4567' },
  { code: 'AE', dial: '+971', labelEn: 'UAE', labelAr: 'الإمارات', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', startDigits: ['5'], minLen: 9, maxLen: 9, placeholder: '50 123 4567' },
  { code: 'KW', dial: '+965', labelEn: 'Kuwait', labelAr: 'الكويت', nameEn: 'Kuwait', nameAr: 'الكويت', startDigits: ['5', '6', '9'], minLen: 8, maxLen: 8, placeholder: '9876 5432' },
  { code: 'BH', dial: '+973', labelEn: 'Bahrain', labelAr: 'البحرين', nameEn: 'Bahrain', nameAr: 'البحرين', startDigits: ['3', '6', '9'], minLen: 8, maxLen: 8, placeholder: '3600 1234' },
  { code: 'OM', dial: '+968', labelEn: 'Oman', labelAr: 'عُمان', nameEn: 'Oman', nameAr: 'سلطنة عمان', startDigits: ['7', '9'], minLen: 8, maxLen: 8, placeholder: '9123 4567' },
  { code: 'EG', dial: '+20', labelEn: 'Egypt', labelAr: 'مصر', nameEn: 'Egypt', nameAr: 'مصر', startDigits: ['10', '11', '12', '15', '1'], minLen: 10, maxLen: 10, placeholder: '10 1234 5678' },
  { code: 'JO', dial: '+962', labelEn: 'Jordan', labelAr: 'الأردن', nameEn: 'Jordan', nameAr: 'الأردن', startDigits: ['7'], minLen: 9, maxLen: 9, placeholder: '7 9123 4567' },
  { code: 'LB', dial: '+961', labelEn: 'Lebanon', labelAr: 'لبنان', nameEn: 'Lebanon', nameAr: 'لبنان', startDigits: ['3', '7', '8'], minLen: 7, maxLen: 8, placeholder: '71 123 456' },
  { code: 'IQ', dial: '+964', labelEn: 'Iraq', labelAr: 'العراق', nameEn: 'Iraq', nameAr: 'العراق', startDigits: ['7'], minLen: 10, maxLen: 10, placeholder: '770 123 4567' },
  { code: 'MA', dial: '+212', labelEn: 'Morocco', labelAr: 'المغرب', nameEn: 'Morocco', nameAr: 'المغرب', startDigits: ['6', '7'], minLen: 9, maxLen: 9, placeholder: '612 345678' },
  { code: 'TN', dial: '+216', labelEn: 'Tunisia', labelAr: 'تونس', nameEn: 'Tunisia', nameAr: 'تونس', startDigits: ['2', '4', '5', '9'], minLen: 8, maxLen: 8, placeholder: '20 123 456' },
  { code: 'DZ', dial: '+213', labelEn: 'Algeria', labelAr: 'الجزائر', nameEn: 'Algeria', nameAr: 'الجزائر', startDigits: ['5', '6', '7'], minLen: 9, maxLen: 9, placeholder: '551 234 567' },
  { code: 'PS', dial: '+970', labelEn: 'Palestine', labelAr: 'فلسطين', nameEn: 'Palestine', nameAr: 'فلسطين', startDigits: ['5'], minLen: 9, maxLen: 9, placeholder: '59 123 4567' },
  { code: 'YE', dial: '+967', labelEn: 'Yemen', labelAr: 'اليمن', nameEn: 'Yemen', nameAr: 'اليمن', startDigits: ['7'], minLen: 9, maxLen: 9, placeholder: '771 234 567' },
  { code: 'SY', dial: '+963', labelEn: 'Syria', labelAr: 'سوريا', nameEn: 'Syria', nameAr: 'سوريا', startDigits: ['9'], minLen: 9, maxLen: 9, placeholder: '944 123 456' },
  { code: 'SD', dial: '+249', labelEn: 'Sudan', labelAr: 'السودان', nameEn: 'Sudan', nameAr: 'السودان', startDigits: ['9', '1'], minLen: 9, maxLen: 9, placeholder: '91 234 5678' },
  { code: 'LY', dial: '+218', labelEn: 'Libya', labelAr: 'ليبيا', nameEn: 'Libya', nameAr: 'ليبيا', startDigits: ['9'], minLen: 9, maxLen: 9, placeholder: '91 234 5678' },
  
  // Major Global Economies & Countries
  { code: 'GB', dial: '+44', labelEn: 'UK', labelAr: 'بريطانيا', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', startDigits: ['7'], minLen: 10, maxLen: 10, placeholder: '7911 123456' },
  { code: 'US', dial: '+1', labelEn: 'USA', labelAr: 'أمريكا', nameEn: 'United States', nameAr: 'الولايات المتحدة', startDigits: ['2', '3', '4', '5', '6', '7', '8', '9'], minLen: 10, maxLen: 10, placeholder: '555 123 4567' },
  { code: 'CA', dial: '+1', labelEn: 'Canada', labelAr: 'كندا', nameEn: 'Canada', nameAr: 'كندا', startDigits: ['2', '3', '4', '5', '6', '7', '8', '9'], minLen: 10, maxLen: 10, placeholder: '555 123 4567' },
  { code: 'CH', dial: '+41', labelEn: 'Swiss', labelAr: 'سويسرا', nameEn: 'Switzerland', nameAr: 'سويسرا', startDigits: ['7'], minLen: 9, maxLen: 9, placeholder: '78 123 45 67' },
  { code: 'DE', dial: '+49', labelEn: 'Germany', labelAr: 'ألمانيا', nameEn: 'Germany', nameAr: 'ألمانيا', startDigits: ['15', '16', '17', '1'], minLen: 10, maxLen: 11, placeholder: '151 12345678' },
  { code: 'FR', dial: '+33', labelEn: 'France', labelAr: 'فرنسا', nameEn: 'France', nameAr: 'فرنسا', startDigits: ['6', '7'], minLen: 9, maxLen: 9, placeholder: '6 12 34 56 78' },
  { code: 'IT', dial: '+39', labelEn: 'Italy', labelAr: 'إيطاليا', nameEn: 'Italy', nameAr: 'إيطاليا', startDigits: ['3'], minLen: 9, maxLen: 10, placeholder: '312 345 6789' },
  { code: 'ES', dial: '+34', labelEn: 'Spain', labelAr: 'إسبانيا', nameEn: 'Spain', nameAr: 'إسبانيا', startDigits: ['6', '7'], minLen: 9, maxLen: 9, placeholder: '612 345 678' },
  { code: 'TR', dial: '+90', labelEn: 'Turkey', labelAr: 'تركيا', nameEn: 'Turkey', nameAr: 'تركيا', startDigits: ['5'], minLen: 10, maxLen: 10, placeholder: '532 123 4567' },
  { code: 'IN', dial: '+91', labelEn: 'India', labelAr: 'الهند', nameEn: 'India', nameAr: 'الهند', startDigits: ['6', '7', '8', '9'], minLen: 10, maxLen: 10, placeholder: '98765 43210' },
  { code: 'PK', dial: '+92', labelEn: 'Pakistan', labelAr: 'باكستان', nameEn: 'Pakistan', nameAr: 'باكستان', startDigits: ['3'], minLen: 10, maxLen: 10, placeholder: '300 1234567' },
  { code: 'BD', dial: '+880', labelEn: 'Bangladesh', labelAr: 'بنغلاديش', nameEn: 'Bangladesh', nameAr: 'بنغلاديش', startDigits: ['1'], minLen: 10, maxLen: 10, placeholder: '1712 345678' },
  { code: 'CN', dial: '+86', labelEn: 'China', labelAr: 'الصين', nameEn: 'China', nameAr: 'الصين', startDigits: ['1'], minLen: 11, maxLen: 11, placeholder: '138 1234 5678' },
  { code: 'JP', dial: '+81', labelEn: 'Japan', labelAr: 'اليابان', nameEn: 'Japan', nameAr: 'اليابان', startDigits: ['7', '8', '9'], minLen: 10, maxLen: 10, placeholder: '90 1234 5678' },
  { code: 'KR', dial: '+82', labelEn: 'Korea', labelAr: 'كوريا', nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', startDigits: ['10', '1'], minLen: 9, maxLen: 10, placeholder: '10 1234 5678' },
  { code: 'AU', dial: '+61', labelEn: 'Australia', labelAr: 'أستراليا', nameEn: 'Australia', nameAr: 'أستراليا', startDigits: ['4'], minLen: 9, maxLen: 9, placeholder: '412 345 678' },
  { code: 'NZ', dial: '+64', labelEn: 'NZ', labelAr: 'نيوزيلندا', nameEn: 'New Zealand', nameAr: 'نيوزيلندا', startDigits: ['2'], minLen: 8, maxLen: 9, placeholder: '21 123 4567' },
  { code: 'SG', dial: '+65', labelEn: 'Singapore', labelAr: 'سنغافورة', nameEn: 'Singapore', nameAr: 'سنغافورة', startDigits: ['8', '9'], minLen: 8, maxLen: 8, placeholder: '8123 4567' },
  { code: 'MY', dial: '+60', labelEn: 'Malaysia', labelAr: 'ماليزيا', nameEn: 'Malaysia', nameAr: 'ماليزيا', startDigits: ['1'], minLen: 9, maxLen: 10, placeholder: '12 345 6789' },
  { code: 'ID', dial: '+62', labelEn: 'Indonesia', labelAr: 'إندونيسيا', nameEn: 'Indonesia', nameAr: 'إندونيسيا', startDigits: ['8'], minLen: 9, maxLen: 12, placeholder: '812 3456 7890' },
  { code: 'PH', dial: '+63', labelEn: 'Philippines', labelAr: 'الفلبين', nameEn: 'Philippines', nameAr: 'الفلبين', startDigits: ['9'], minLen: 10, maxLen: 10, placeholder: '917 123 4567' },
  { code: 'TH', dial: '+66', labelEn: 'Thailand', labelAr: 'تايلاند', nameEn: 'Thailand', nameAr: 'تايلاند', startDigits: ['6', '8', '9'], minLen: 9, maxLen: 9, placeholder: '81 234 5678' },
  { code: 'VN', dial: '+84', labelEn: 'Vietnam', labelAr: 'فيتنام', nameEn: 'Vietnam', nameAr: 'فيتنام', startDigits: ['3', '5', '7', '8', '9'], minLen: 9, maxLen: 10, placeholder: '91 234 5678' },
  { code: 'RU', dial: '+7', labelEn: 'Russia', labelAr: 'روسيا', nameEn: 'Russia', nameAr: 'روسيا', startDigits: ['9'], minLen: 10, maxLen: 10, placeholder: '912 345 6789' },
  { code: 'BR', dial: '+55', labelEn: 'Brazil', labelAr: 'البرازيل', nameEn: 'Brazil', nameAr: 'البرازيل', startDigits: ['9', '6', '7', '8'], minLen: 10, maxLen: 11, placeholder: '11 91234 5678' },
  { code: 'MX', dial: '+52', labelEn: 'Mexico', labelAr: 'المكسيك', nameEn: 'Mexico', nameAr: 'المكسيك', startDigits: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], minLen: 10, maxLen: 10, placeholder: '55 1234 5678' },
  { code: 'AR', dial: '+54', labelEn: 'Argentina', labelAr: 'الأرجنتين', nameEn: 'Argentina', nameAr: 'الأرجنتين', startDigits: ['9', '1'], minLen: 10, maxLen: 10, placeholder: '9 11 1234 5678' },
  { code: 'CL', dial: '+56', labelEn: 'Chile', labelAr: 'تشيلي', nameEn: 'Chile', nameAr: 'تشيلي', startDigits: ['9'], minLen: 9, maxLen: 9, placeholder: '9 1234 5678' },
  { code: 'CO', dial: '+57', labelEn: 'Colombia', labelAr: 'كولومبيا', nameEn: 'Colombia', nameAr: 'كولومبيا', startDigits: ['3'], minLen: 10, maxLen: 10, placeholder: '300 123 4567' },
  { code: 'ZA', dial: '+27', labelEn: 'South Africa', labelAr: 'جنوب أفريقيا', nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', startDigits: ['6', '7', '8'], minLen: 9, maxLen: 9, placeholder: '71 123 4567' },
  { code: 'NG', dial: '+234', labelEn: 'Nigeria', labelAr: 'نيجيريا', nameEn: 'Nigeria', nameAr: 'نيجيريا', startDigits: ['7', '8', '9'], minLen: 10, maxLen: 10, placeholder: '802 123 4567' },
  { code: 'KE', dial: '+254', labelEn: 'Kenya', labelAr: 'كينيا', nameEn: 'Kenya', nameAr: 'كينيا', startDigits: ['7', '1'], minLen: 9, maxLen: 9, placeholder: '712 345678' },
  { code: 'GH', dial: '+233', labelEn: 'Ghana', labelAr: 'غانا', nameEn: 'Ghana', nameAr: 'غانا', startDigits: ['2', '5'], minLen: 9, maxLen: 9, placeholder: '24 123 4567' },
  { code: 'SE', dial: '+46', labelEn: 'Sweden', labelAr: 'السويد', nameEn: 'Sweden', nameAr: 'السويد', startDigits: ['7'], minLen: 9, maxLen: 9, placeholder: '70 123 45 67' },
  { code: 'NO', dial: '+47', labelEn: 'Norway', labelAr: 'النرويج', nameEn: 'Norway', nameAr: 'النرويج', startDigits: ['4', '9'], minLen: 8, maxLen: 8, placeholder: '412 34 567' },
  { code: 'DK', dial: '+45', labelEn: 'Denmark', labelAr: 'الدنمارك', nameEn: 'Denmark', nameAr: 'الدنمارك', startDigits: ['2', '3', '4', '5', '6', '7', '8', '9'], minLen: 8, maxLen: 8, placeholder: '20 12 34 56' },
  { code: 'NL', dial: '+31', labelEn: 'Netherlands', labelAr: 'هولندا', nameEn: 'Netherlands', nameAr: 'هولندا', startDigits: ['6'], minLen: 9, maxLen: 9, placeholder: '6 12345678' },
  { code: 'BE', dial: '+32', labelEn: 'Belgium', labelAr: 'بلجيكا', nameEn: 'Belgium', nameAr: 'بلجيكا', startDigits: ['4'], minLen: 9, maxLen: 9, placeholder: '470 12 34 56' },
  { code: 'AT', dial: '+43', labelEn: 'Austria', labelAr: 'النمسا', nameEn: 'Austria', nameAr: 'النمسا', startDigits: ['6'], minLen: 10, maxLen: 10, placeholder: '664 1234567' },
  { code: 'GR', dial: '+30', labelEn: 'Greece', labelAr: 'اليونان', nameEn: 'Greece', nameAr: 'اليونان', startDigits: ['6'], minLen: 10, maxLen: 10, placeholder: '691 234 5678' },
  { code: 'PT', dial: '+351', labelEn: 'Portugal', labelAr: 'البرتغال', nameEn: 'Portugal', nameAr: 'البرتغال', startDigits: ['9'], minLen: 9, maxLen: 9, placeholder: '912 345 678' },
  { code: 'PL', dial: '+48', labelEn: 'Poland', labelAr: 'بولندا', nameEn: 'Poland', nameAr: 'بولندا', startDigits: ['5', '6', '7', '8'], minLen: 9, maxLen: 9, placeholder: '512 345 678' },
  { code: 'RO', dial: '+40', labelEn: 'Romania', labelAr: 'رومانيا', nameEn: 'Romania', nameAr: 'رومانيا', startDigits: ['7'], minLen: 9, maxLen: 9, placeholder: '712 345 678' },
  { code: 'CZ', dial: '+420', labelEn: 'Czech', labelAr: 'التشيك', nameEn: 'Czech Republic', nameAr: 'التشيك', startDigits: ['6', '7'], minLen: 9, maxLen: 9, placeholder: '601 123 456' },
  { code: 'HU', dial: '+36', labelEn: 'Hungary', labelAr: 'المجر', nameEn: 'Hungary', nameAr: 'المجر', startDigits: ['2', '3', '7'], minLen: 9, maxLen: 9, placeholder: '20 123 4567' },
  { code: 'IE', dial: '+353', labelEn: 'Ireland', labelAr: 'أيرلندا', nameEn: 'Ireland', nameAr: 'أيرلندا', startDigits: ['8'], minLen: 9, maxLen: 9, placeholder: '85 123 4567' },
  { code: 'FI', dial: '+358', labelEn: 'Finland', labelAr: 'فنلندا', nameEn: 'Finland', nameAr: 'فنلندا', startDigits: ['4', '5'], minLen: 9, maxLen: 10, placeholder: '40 123 4567' },
  { code: 'UA', dial: '+380', labelEn: 'Ukraine', labelAr: 'أوكرانيا', nameEn: 'Ukraine', nameAr: 'أوكرانيا', startDigits: ['5', '6', '7', '8', '9'], minLen: 9, maxLen: 9, placeholder: '50 123 4567' },
  { code: 'AZ', dial: '+994', labelEn: 'Azerbaijan', labelAr: 'أذربيجان', nameEn: 'Azerbaijan', nameAr: 'أذربيجان', startDigits: ['5', '7', '9'], minLen: 9, maxLen: 9, placeholder: '50 123 45 67' },
  { code: 'KZ', dial: '+7', labelEn: 'Kazakhstan', labelAr: 'كازاخستان', nameEn: 'Kazakhstan', nameAr: 'كازاخستان', startDigits: ['7'], minLen: 10, maxLen: 10, placeholder: '701 123 4567' },
  { code: 'UZ', dial: '+998', labelEn: 'Uzbekistan', labelAr: 'أوزبكستان', nameEn: 'Uzbekistan', nameAr: 'أوزبكستان', startDigits: ['9'], minLen: 9, maxLen: 9, placeholder: '90 123 45 67' },
  { code: 'AF', dial: '+93', labelEn: 'Afghanistan', labelAr: 'أفغانستان', nameEn: 'Afghanistan', nameAr: 'أفغانستان', startDigits: ['7'], minLen: 9, maxLen: 9, placeholder: '70 123 4567' },
  { code: 'AL', dial: '+355', labelEn: 'Albania', labelAr: 'ألبانيا', nameEn: 'Albania', nameAr: 'ألبانيا', startDigits: ['6'], minLen: 9, maxLen: 9, placeholder: '67 123 4567' },
  { code: 'CY', dial: '+357', labelEn: 'Cyprus', labelAr: 'قبرص', nameEn: 'Cyprus', nameAr: 'قبرص', startDigits: ['9'], minLen: 8, maxLen: 8, placeholder: '99 123456' },
  { code: 'MT', dial: '+356', labelEn: 'Malta', labelAr: 'مالطا', nameEn: 'Malta', nameAr: 'مالطا', startDigits: ['7', '9'], minLen: 8, maxLen: 8, placeholder: '9912 3456' },
  { code: 'IS', dial: '+354', labelEn: 'Iceland', labelAr: 'آيسلندا', nameEn: 'Iceland', nameAr: 'آيسلندا', startDigits: ['6', '7', '8'], minLen: 7, maxLen: 7, placeholder: '612 3456' },
  { code: 'LU', dial: '+352', labelEn: 'Luxembourg', labelAr: 'لوكسمبورغ', nameEn: 'Luxembourg', nameAr: 'لوكسمبورغ', startDigits: ['6'], minLen: 9, maxLen: 9, placeholder: '621 123 456' },
  { code: 'MC', dial: '+377', labelEn: 'Monaco', labelAr: 'موناكو', nameEn: 'Monaco', nameAr: 'موناكو', startDigits: ['6'], minLen: 8, maxLen: 8, placeholder: '6 12 34 56 78' },
  { code: 'AD', dial: '+376', labelEn: 'Andorra', labelAr: 'أندورا', nameEn: 'Andorra', nameAr: 'أندورا', startDigits: ['3', '6', '8'], minLen: 6, maxLen: 6, placeholder: '312 345' },
  { code: 'SM', dial: '+378', labelEn: 'San Marino', labelAr: 'سان مارينو', nameEn: 'San Marino', nameAr: 'سان مارينو', startDigits: ['6'], minLen: 8, maxLen: 8, placeholder: '66 123456' },
  { code: 'VA', dial: '+379', labelEn: 'Vatican', labelAr: 'الفاتيكان', nameEn: 'Vatican City', nameAr: 'الفاتيكان', startDigits: ['0', '3', '6'], minLen: 10, maxLen: 10, placeholder: '06 69812345' }
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

    // Strip national trunk prefix '0' if present (e.g. 0501234567 -> 501234567)
    if (country && digits.startsWith('0') && digits.length > country.minLen) {
      digits = digits.substring(1);
    }

    return digits;
  },

  validatePhoneNumber(country, rawNumber) {
    if (!country) return false;
    const digits = this.cleanPhoneNumber(country, rawNumber);
    if (!digits) return false;

    // Check length requirements
    if (digits.length < country.minLen || digits.length > country.maxLen) {
      return false;
    }

    // Check starting digits rule
    if (country.startDigits && country.startDigits.length > 0) {
      const isValidStart = country.startDigits.some(prefix => digits.startsWith(prefix));
      if (!isValidStart) {
        return false;
      }
    }

    return true;
  },

  getValidationHint(country, lang = 'en') {
    if (!country) return '';
    const name = lang === 'ar' ? country.nameAr : country.nameEn;
    const starts = country.startDigits ? country.startDigits.join(', ') : '';
    if (lang === 'ar') {
      return starts 
        ? `${name} (${country.dial}): يجب أن يبدأ بـ (${starts}) ويتكون من ${country.minLen} أرقام.`
        : `${name} (${country.dial}): يتكون من ${country.minLen} أرقام.`;
    } else {
      return starts
        ? `${name} (${country.dial}): Must start with (${starts}) and be ${country.minLen} digits.`
        : `${name} (${country.dial}): Must be ${country.minLen} digits.`;
    }
  },

  renderDialSelects() {
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    
    document.querySelectorAll('.country-code-select').forEach(select => {
      const currentVal = select.value || '+974';
      select.innerHTML = COUNTRIES_DATA.map(c => {
        const countryLabel = lang === 'ar' ? (c.labelAr || c.nameAr) : (c.labelEn || c.nameEn);
        return `<option value="${c.dial}" data-code="${c.code}" ${c.dial === currentVal ? 'selected' : ''}>${countryLabel} ${c.dial}</option>`;
      }).join('');
      select.value = currentVal;
    });

    document.querySelectorAll('.country-select-dropdown').forEach(select => {
      const currentVal = select.value || 'QA';
      select.innerHTML = COUNTRIES_DATA.map(c => {
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
        input.placeholder = country.placeholder || '7104 0746';
        input.setAttribute('maxlength', country.maxLen + 4);
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
              phoneInput.placeholder = country.placeholder;
              phoneInput.setAttribute('maxlength', country.maxLen + 4);
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
            phoneInput.placeholder = country.placeholder;
            phoneInput.setAttribute('maxlength', country.maxLen + 4);
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

    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('phone-number-field') || e.target.type === 'tel') {
        checkWrap(e.target);
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
    CountriesHelper.init();
    this.setupNavbarScroll();
    this.setupMobileMenu();
    this.setupSearchModal();
    this.setupWishlistDrawer();
    this.setupQuickViewModal();
    this.setupScrollAnimations();
    this.setupNewsletter();
    this.setupWhatsAppWidget();
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
    }
  },

  renderSearchResults(query) {
    const resultsContainer = document.getElementById('global-search-results');
    if (!resultsContainer) return;

    const lang = I18n.getLang();
    const products = ProductService.search(query, lang);

    if (products.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p>${I18n.t('searchNoResults')}</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = products.map(p => {
      const name = p.name[lang] || p.name.en;
      const tagline = p.tagline[lang] || p.tagline.en;
      return `
        <a href="product.html?id=${p.id}" class="search-result-item">
          <div class="search-item-img">
            <img src="${p.images[0]}" alt="${name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=300&q=80'">
          </div>
          <div class="search-item-details">
            <div class="search-item-brand">${p.brand}</div>
            <div class="search-item-title">${name}</div>
            <div class="search-item-tagline">${tagline}</div>
          </div>
          <div class="search-item-pricing">
            <span class="search-item-price">$${p.basePrice.toLocaleString()}</span>
          </div>
        </a>
      `;
    }).join('');
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
      return `
        <div class="cart-drawer-item">
          <div class="cart-drawer-img">
            <img src="${p.images[0]}" alt="${name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=300&q=80'">
          </div>
          <div class="cart-drawer-info">
            <div class="cart-drawer-brand">${p.brand}</div>
            <h4 class="cart-drawer-title"><a href="product.html?id=${p.id}">${name}</a></h4>
            <div class="cart-drawer-price">$${p.basePrice.toLocaleString()}</div>
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
        <span class="storage-pill">${s.size}</span>
      </label>
    `).join('') : '';

    content.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-gallery">
          <div class="quickview-main-image">
            <img id="qv-main-img" src="${product.images[0]}" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'">
          </div>
          <div class="quickview-thumbs">
            ${product.images.map((img, i) => `
              <button type="button" class="qv-thumb ${i === 0 ? 'active' : ''}" onclick="document.getElementById('qv-main-img').src = '${img}'; document.querySelectorAll('.qv-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
                <img src="${img}" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="quickview-info">
          <div class="product-card-meta" style="margin-bottom: 8px;">
            <span class="product-brand" style="margin-bottom: 0;">${product.brand}</span>
            <span class="product-condition-tag ${
              (product.condition || 'new') === 'new' ? 'badge-condition-new' :
              (product.condition || 'new') === 'like-new' ? 'badge-condition-likenew' : 'badge-condition-certified'
            }">
              ${
                (product.condition || 'new') === 'new' ? (lang === 'ar' ? '✨ غير مستخدم نهائياً' : '✨ Never Used') :
                (product.condition || 'new') === 'like-new' ? (lang === 'ar' ? '💎 مستعمل كالجديد (<1 سنة)' : '💎 Like New (<1Y)') :
                (lang === 'ar' ? '🛡️ مجدد معتمد (<3 سنوات)' : '🛡️ Certified (<3Y)')
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
            <span class="quickview-price" id="qv-price-display">$${product.basePrice.toLocaleString()}</span>
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
              <span>${I18n.t('tabSpecs')} & Details →</span>
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
        if (priceEl) priceEl.textContent = `$${newPrice.toLocaleString()}`;
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="global-search-input" class="search-modal-input" placeholder="${I18n.t('searchPlaceholder')}" autocomplete="off">
              <button type="button" class="btn-close-search modal-close-btn">&times;</button>
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
              <p class="auth-subtitle">Access your orders and account settings.</p>
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
                  <a href="#" class="form-link-subtle" data-i18n="authForgotPassword">${I18n.t('authForgotPassword')}</a>
                </div>
                <input type="password" name="password" class="form-input" placeholder="••••••••" required>
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
              <p class="auth-subtitle">Create an account to track orders and customize your profile.</p>
            </div>
            <div id="signup-error" class="auth-error-alert" style="display:none;"></div>
            <form id="form-signup" class="auth-form">
              <div class="form-group">
                <label class="form-label" data-i18n="authName">${I18n.t('authName')}</label>
                <input type="text" name="name" class="form-input" placeholder="Alexander Vance" required>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="authEmail">${I18n.t('authEmail')}</label>
                <input type="email" name="email" class="form-input" placeholder="name@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="authPassword">${I18n.t('authPassword')}</label>
                <input type="password" name="password" class="form-input" placeholder="Create password" required minlength="6">
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="authSignUpBtn">${I18n.t('authSignUpBtn')}</button>
            </form>
            <div class="auth-footer">
              <span data-i18n="authHaveAccount">${I18n.t('authHaveAccount')}</span>
              <button type="button" class="auth-switch-link" onclick="Auth.openSignInModal()" data-i18n="authSignInBtn">${I18n.t('authSignInBtn')}</button>
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
                    <input type="tel" id="profile-phone-input" class="form-input phone-number-field" placeholder="7104 0746">
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
              <span id="cart-drawer-subtotal" class="drawer-subtotal-amount">$0</span>
            </div>
            <div class="drawer-footer-actions">
              <a href="cart.html" class="btn btn-primary btn-block btn-lg" data-i18n="proceedToCheckout">${I18n.t('proceedToCheckout')}</a>
            </div>
          </div>
        </div>

        <!-- Floating WhatsApp Widget -->
        <div class="diamond-whatsapp-widget" id="diamond-whatsapp">
          <div class="whatsapp-bubble-tooltip">
            <div class="tooltip-header">
              <span class="online-indicator"></span>
              <strong data-i18n="whatsappWidgetTitle">${I18n.t('whatsappWidgetTitle')}</strong>
            </div>
            <p data-i18n="whatsappWidgetPrompt">${I18n.t('whatsappWidgetPrompt')}</p>
          </div>
          <button type="button" class="btn-whatsapp-floating" id="btn-whatsapp-floating" aria-label="WhatsApp Concierge">
            <span class="whatsapp-beacon"></span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.954.815 2.796.815 3.183 0 5.769-2.587 5.77-5.768 0-3.181-2.587-5.767-5.77-5.767zm0 10.428c-.808 0-1.637-.24-2.348-.662l-.168-.1-1.748.459.467-1.704-.11-.175c-.477-.757-.729-1.554-.728-2.48 0-2.494 2.029-4.523 4.525-4.523 2.495 0 4.525 2.029 4.525 4.523 0 2.495-2.03 4.525-4.525 4.525zm2.483-3.393c-.136-.068-.807-.398-.932-.444-.125-.045-.216-.068-.307.068-.091.136-.352.444-.432.535-.08.091-.159.102-.295.034-.136-.068-.574-.212-1.094-.675-.404-.36-.677-.805-.756-.941-.08-.136-.008-.21.06-.277.062-.061.136-.159.204-.239.068-.08.091-.136.136-.227.045-.091.023-.17-.011-.239-.034-.068-.307-.738-.42-1.011-.11-.266-.223-.23-.307-.234l-.261-.005c-.091 0-.239.034-.364.17-.125.136-.477.466-.477 1.136 0 .67.489 1.318.557 1.409.068.091.962 1.469 2.33 2.059.325.14.579.224.777.287.327.104.624.089.859.054.262-.039.807-.33 1.02-.648.213-.318.213-.591.15-.648-.063-.057-.154-.091-.29-.159z"/>
              <path d="M12.032 2C6.505 2 2.025 6.48 2.025 12.008c0 1.954.563 3.778 1.541 5.321L2 22l4.832-1.528A9.957 9.957 0 0 0 12.032 22C17.56 22 22.04 17.52 22.04 12.008 22.04 6.48 17.56 2 12.032 2zm0 18.232c-1.637 0-3.177-.47-4.49-1.284l-.322-.199-2.868.906.924-2.8-.218-.347A8.21 8.21 0 0 1 3.808 12.008c0-4.535 3.689-8.225 8.224-8.225 4.536 0 8.225 3.69 8.225 8.225 0 4.535-3.689 8.224-8.225 8.224z"/>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(modalsDiv);
      if (typeof I18n !== 'undefined') {
        I18n.applyLanguage(I18n.getLang());
      }
    }
  }
};

// Global Fallback for any image load failure
window.addEventListener('error', (e) => {
  if (e.target && e.target.tagName === 'IMG') {
    const fallbackSrc = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';
    if (e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
