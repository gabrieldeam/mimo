export function validateRegistration(values) {
  const errors = {};
  const fields = { name: 'nome completo', email: 'e-mail', nickname: 'apelido do tutor', petName: 'nome do bichinho' };
  Object.keys(fields).forEach((key) => { if (!values[key]?.trim()) errors[key] = `Informe o ${fields[key]}.`; });
  if (values.email?.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = 'Digite um e-mail válido.';
  return errors;
}
