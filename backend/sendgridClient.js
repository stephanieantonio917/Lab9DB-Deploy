const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendNewPuppyEmail = async (puppy) => {
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.SENDGRID_FROM,
    subject: `🐶 New Puppy Added: ${puppy.name}`,
    text: `${puppy.name}, ${puppy.age_est} years old, ${puppy.breed} has just been added to the system!`,
    html: `<strong>${puppy.name}</strong>, ${puppy.age_est} years old, ${puppy.breed} has just been added to the system!`,
  };
  

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent!');
  } catch (error) {
    console.error('❌ Email error:', error.response?.body || error.message);
  }
};

module.exports = sendNewPuppyEmail;
