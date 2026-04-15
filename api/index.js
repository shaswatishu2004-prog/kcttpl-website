const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle the form submission POST request
app.post('/api/inquire', async (req, res) => {
    const { name_contact, company_industry, pincode, tonnage, delivery_preference } = req.body;

    // Configure the email transport using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kcttpl@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD // We will set this up in Step 4
        }
    });

    // Structure the email content
    const mailOptions = {
        from: 'kcttpl@gmail.com',
        to: 'kcttpl@gmail.com',
        subject: `New Website Inquiry: ${company_industry}`,
        text: `
You have received a new inquiry from the KCTTPL website:

1. Name & Contact: ${name_contact}
2. Company & Industry: ${company_industry}
3. Delivery PIN Code: ${pincode}
4. Monthly Tonnage Required: ${tonnage}
5. Delivery Preference: ${delivery_preference}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        // Send a success message and redirect back to the homepage
        res.send(`
            <script>
                alert("Thank you! Your inquiry has been sent successfully.");
                window.location.href = "/";
            </script>
        `);
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send(`
            <script>
                alert("Sorry, there was an error sending your inquiry. Please try again later or contact us directly.");
                window.location.href = "/#contact";
            </script>
        `);
    }
});

// Fallback to index.html for root or other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Export the Express API for Vercel
module.exports = app;

// If we are not running on Vercel, start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
