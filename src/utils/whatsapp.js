const WHATSAPP_NUMBER = '31644831515';

export function selfCheckUrl(symptoms) {
  let message =
    'Hoi Rivv! Ik wil graag vrijblijvend advies over mijn ventilatie.';
  if (symptoms.length) message += ` Wat ik herken: ${symptoms.join(', ')}.`;
  message += ' Mijn postcode is: ';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
