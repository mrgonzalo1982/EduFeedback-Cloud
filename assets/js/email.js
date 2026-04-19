/* =====================================================================
   EMAIL ENGINE — EMAILJS INTEGRATION
   ===================================================================== */

async function handleEmailGroup() {
    const ev = getEv();
    if (!ev.unit) {
        showToast("Please select a Unit first", "var(--red)");
        return;
    }

    const config = getRubric();
    const students = ST.curGroup.studentIds.map(sid => getStu(sid));
    const bccEmails = students.map(s => s.email).filter(e => !!e).join(',');

    if (!bccEmails) {
        showToast("No student emails found in this group.", "var(--red)");
        return;
    }

    const serviceID = localStorage.getItem('ef_emailjs_service_id');
    const templateID = localStorage.getItem('ef_emailjs_template_id');
    const publicKey = localStorage.getItem('ef_emailjs_public_key');

    if (!serviceID || !templateID || !publicKey) {
        showToast("EmailJS not configured. Check Cloud Setup.", "var(--red)");
        openModal('modal-firebase'); // Help them find where to configure
        return;
    }

    const btn = document.getElementById('btn-email-group');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="ai-spin">⏳</i> Sending...`;

    try {
        // Generate a group summary HTML
        const groupFeedbackData = students.map(s => {
            const sEv = getStuEv(s.id);
            const tot = stuTotal(sEv);
            return {
                name: `${s.fn} ${s.ln}`,
                score: `${tot}/${config.totalPts}`,
                pct: `${Math.round((tot/config.totalPts)*100)}%`
            };
        });

        const templateParams = {
            to_name: currentUser ? currentUser.displayName : "Professor",
            to_email: currentUser ? currentUser.email : "",
            bcc_email: bccEmails,
            assessment_name: config.assessmentLabel,
            unit_name: `Unit ${ev.unit}`,
            group_name: ST.curGroup.name,
            message_formal: `Estimados estudiantes,\n\nEspero que este mensaje les encuentre muy bien. Les escribo para compartirles los resultados obtenidos en su reciente evaluación grupal de "${config.assessmentLabel}".\n\nAdjunto en este cuerpo de correo encontrarán el desglose de su desempeño y los comentarios pedagógicos para seguir creciendo en su proceso de aprendizaje.\n\nAtentamente,`,
            // This will be rendered inside the EmailJS template as triple curly braces {{{html_content}}}
            html_content: buildEmailHTML(ST.curGroup, config)
        };

        await emailjs.send(serviceID, templateID, templateParams);
        showToast("Emails sent successfully to the group!", "var(--green)");
    } catch (error) {
        console.error("Email Error:", error);
        showToast("Failed to send email. Check EmailJS config.", "var(--red)");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function buildEmailHTML(group, config) {
    // Generate a clean HTML table for the email body
    let html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #6d28d9; border-bottom: 2px solid #6d28d9; padding-bottom: 10px;">${config.assessmentLabel} - Results</h2>
        <p><strong>Group:</strong> ${group.name}</p>
        <p><strong>Section:</strong> ${ST.section}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background: #f9fafb;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Student</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Score</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">%</th>
                </tr>
            </thead>
            <tbody>`;

    group.studentIds.forEach(sid => {
        const s = getStu(sid);
        const sEv = getStuEv(sid);
        const tot = stuTotal(sEv);
        const pct = Math.round((tot/config.totalPts)*100);
        html += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #eee;">${s.fn} ${s.ln}</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center; font-weight: bold;">${tot}/${config.totalPts}</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${pct}%</td>
                </tr>`;
    });

    html += `
            </tbody>
        </table>
        
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="color: #166534; margin: 0 0 5px 0;">Strengths</h4>
            <div style="font-size: 14px; color: #166534;">(Consulte su rúbrica detallada en clase para más detalles)</div>
        </div>
        
        <p style="font-size: 12px; color: #666; font-style: italic; margin-top: 30px;">
            Generated by EduFeedback v2 — Personalized AI Assessment System.
        </p>
    </div>`;
    
    return html;
}
