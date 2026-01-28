import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, Activity, Calendar, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const HealthReportGenerator = ({ analysis, symptoms }) => {
  const [generating, setGenerating] = useState(false);

  const generatePDFContent = () => {
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MediConnect AI - Health Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 40px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .section {
      background: #f8f9fa;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 12px;
      border-left: 5px solid #667eea;
    }
    .section h2 {
      color: #667eea;
      font-size: 20px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .symptoms-list {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-top: 10px;
    }
    .condition-box {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      border: 2px solid #e0e0e0;
    }
    .urgency-high {
      background: #fee;
      border-color: #f44336;
    }
    .urgency-medium {
      background: #fff8e1;
      border-color: #ff9800;
    }
    .urgency-low {
      background: #e8f5e9;
      border-color: #4caf50;
    }
    .badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .badge-high { background: #f44336; color: white; }
    .badge-medium { background: #ff9800; color: white; }
    .badge-low { background: #4caf50; color: white; }
    .recommendations {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-top: 10px;
    }
    .recommendations li {
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .recommendations li:last-child { border-bottom: none; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }
    .disclaimer {
      background: #fff3cd;
      border: 2px solid #ffc107;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 13px;
    }
    .metric {
      display: inline-block;
      background: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin: 5px;
      text-align: center;
      min-width: 150px;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏥 MediConnect AI</h1>
    <p>AI-Powered Health Analysis Report</p>
    <p>Generated on ${date}</p>
  </div>

  <div class="section">
    <h2>📋 Reported Symptoms</h2>
    <div class="symptoms-list">
      <p><strong>Patient Description:</strong></p>
      <p style="margin-top: 10px; font-size: 15px;">${symptoms || 'Not specified'}</p>
    </div>
  </div>

  ${analysis ? `
  <div class="section">
    <h2>🔍 AI Analysis Results</h2>
    <div class="metric">
      <div class="metric-value">${analysis.urgency_level || 'MODERATE'}</div>
      <div class="metric-label">Urgency Level</div>
    </div>
    <div class="metric">
      <div class="metric-value">${analysis.possible_conditions?.length || 0}</div>
      <div class="metric-label">Possible Conditions</div>
    </div>
  </div>

  ${analysis.possible_conditions?.length > 0 ? `
  <div class="section">
    <h2>🏥 Possible Medical Conditions</h2>
    ${analysis.possible_conditions.map((condition, idx) => `
      <div class="condition-box urgency-${analysis.urgency_level?.toLowerCase() || 'low'}">
        <h3 style="color: #333; margin-bottom: 10px;">${idx + 1}. ${condition}</h3>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${analysis.recommendations?.length > 0 ? `
  <div class="section">
    <h2>💊 Medical Recommendations</h2>
    <div class="recommendations">
      <ul style="padding-left: 20px;">
        ${analysis.recommendations.map(rec => `<li>✓ ${rec}</li>`).join('')}
      </ul>
    </div>
  </div>
  ` : ''}

  ${analysis.suggested_specialties?.length > 0 ? `
  <div class="section">
    <h2>👨‍⚕️ Recommended Medical Specialties</h2>
    <div class="recommendations">
      ${analysis.suggested_specialties.map(specialty => `
        <span class="badge" style="background: #667eea; color: white; margin: 5px;">${specialty}</span>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${analysis.warning_signs?.length > 0 ? `
  <div class="section" style="border-left-color: #f44336;">
    <h2 style="color: #f44336;">⚠️ Warning Signs to Watch</h2>
    <div class="recommendations">
      <ul style="padding-left: 20px; color: #d32f2f;">
        ${analysis.warning_signs.map(sign => `<li>• ${sign}</li>`).join('')}
      </ul>
    </div>
  </div>
  ` : ''}
  ` : ''}

  <div class="section" style="border-left-color: #4caf50; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);">
    <h2 style="color: #2e7d32;">💚 Stay Calm & Positive / ಶಾಂತವಾಗಿರಿ ಮತ್ತು ಸಕಾರಾತ್ಮಕವಾಗಿರಿ</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 10px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
        <div>
          <p style="font-size: 16px; color: #1b5e20; margin-bottom: 10px;">
            <strong>English:</strong>
          </p>
          <p style="color: #2e7d32;">
            Remember: Don't worry! Most health issues are manageable with proper care and attention.
          </p>
        </div>
        <div>
          <p style="font-size: 16px; color: #1b5e20; margin-bottom: 10px;">
            <strong>ಕನ್ನಡ:</strong>
          </p>
          <p style="color: #2e7d32;">
            ನೆನಪಿಡಿ: ಚಿಂತಿಸಬೇಡಿ! ಹೆಚ್ಚಿನ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಸರಿಯಾದ ಆರೈಕೆ ಮತ್ತು ಗಮನದಿಂದ ನಿರ್ವಹಿಸಬಹುದು.
          </p>
        </div>
      </div>
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 10px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <p style="color: #2e7d32;">
            <strong>🧘 Keep Calm:</strong> Stress can worsen symptoms. Take deep breaths and stay positive.
          </p>
          <p style="color: #2e7d32;">
            <strong>🧘 ಶಾಂತವಾಗಿರಿ:</strong> ಒತ್ತಡವು ರೋಗಲಕ್ಷಣಗಳನ್ನು ಹದಗೆಡಿಸಬಹುದು. ಆಳವಾಗಿ ಉಸಿರಾಡಿ ಮತ್ತು ಸಕಾರಾತ್ಮಕವಾಗಿರಿ.
          </p>
        </div>
      </div>
      <div style="background: #fff9c4; padding: 15px; border-radius: 8px; border-left: 4px solid #fdd835; margin: 10px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <p style="color: #f57f17;">
            <strong>⏰ Early Action:</strong> Addressing health concerns early often leads to better outcomes.
          </p>
          <p style="color: #f57f17;">
            <strong>⏰ ತ್ವರಿತ ಕ್ರಮ:</strong> ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಬೇಗ ಗಮನಿಸುವುದು ಉತ್ತಮ ಫಲಿತಾಂಶಗಳಿಗೆ ಕಾರಣವಾಗುತ್ತದೆ.
          </p>
        </div>
      </div>
      <div style="background: #e1f5fe; padding: 15px; border-radius: 8px; border-left: 4px solid #039be5; margin: 10px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <p style="color: #01579b;">
            <strong>👨‍⚕️ Professional Care:</strong> Consulting a doctor is always the right decision when in doubt.
          </p>
          <p style="color: #01579b;">
            <strong>👨‍⚕️ ವೃತ್ತಿಪರ ಆರೈಕೆ:</strong> ಸಂದೇಹವಿದ್ದಾಗ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಯಾವಾಗಲೂ ಸರಿಯಾದ ನಿರ್ಧಾರ.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="section" style="border-left-color: #2196f3;">
    <h2 style="color: #1976d2;">💡 Daily Wellness Tips / ದೈನಂದಿನ ಆರೋಗ್ಯ ಸಲಹೆಗಳು</h2>
    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #e3f2fd;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2196f3; width: 50%;">English</th>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2196f3; width: 50%;">ಕನ್ನಡ</th>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px;">
            <strong>💧 Hydration:</strong> Drink 8-10 glasses of water daily
          </td>
          <td style="padding: 12px;">
            <strong>💧 ನೀರು:</strong> ದಿನಕ್ಕೆ 8-10 ಗ್ಲಾಸ್ ನೀರು ಕುಡಿಯಿರಿ
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0; background: #f5f5f5;">
          <td style="padding: 12px;">
            <strong>🛌 Rest:</strong> Get 7-8 hours of quality sleep
          </td>
          <td style="padding: 12px;">
            <strong>🛌 ವಿಶ್ರಾಂತಿ:</strong> 7-8 ಗಂಟೆಗಳ ಉತ್ತಮ ನಿದ್ರೆ ಪಡೆಯಿರಿ
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px;">
            <strong>🥗 Nutrition:</strong> Eat balanced meals with fruits & vegetables
          </td>
          <td style="padding: 12px;">
            <strong>🥗 ಪೌಷ್ಟಿಕಾಂಶ:</strong> ಹಣ್ಣು ಮತ್ತು ತರಕಾರಿಗಳೊಂದಿಗೆ ಸಮತೋಲಿತ ಊಟ
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0; background: #f5f5f5;">
          <td style="padding: 12px;">
            <strong>🚶 Light Activity:</strong> 30 minutes of gentle exercise daily
          </td>
          <td style="padding: 12px;">
            <strong>🚶 ಲಘು ವ್ಯಾಯಾಮ:</strong> ದಿನಕ್ಕೆ 30 ನಿಮಿಷಗಳ ಲಘು ವ್ಯಾಯಾಮ
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px;">
            <strong>🧘 Stress Relief:</strong> Practice meditation or deep breathing
          </td>
          <td style="padding: 12px;">
            <strong>🧘 ಒತ್ತಡ ನಿವಾರಣೆ:</strong> ಧ್ಯಾನ ಅಥವಾ ಆಳವಾದ ಉಸಿರಾಟದ ಅಭ್ಯಾಸ
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0; background: #f5f5f5;">
          <td style="padding: 12px;">
            <strong>📱 Stay Connected:</strong> Talk to family for emotional support
          </td>
          <td style="padding: 12px;">
            <strong>📱 ಸಂಪರ್ಕದಲ್ಲಿರಿ:</strong> ಭಾವನಾತ್ಮಕ ಬೆಂಬಲಕ್ಕಾಗಿ ಕುಟುಂಬದೊಂದಿಗೆ ಮಾತನಾಡಿ
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px;">
            <strong>🌞 Positive Mindset:</strong> Focus on what you can control
          </td>
          <td style="padding: 12px;">
            <strong>🌞 ಧನಾತ್ಮಕ ಮನೋಭಾವ:</strong> ನೀವು ನಿಯಂತ್ರಿಸಬಹುದಾದದ್ದರ ಮೇಲೆ ಗಮನ ಹರಿಸಿ
          </td>
        </tr>
        <tr style="background: #f5f5f5;">
          <td style="padding: 12px;">
            <strong>📝 Track Progress:</strong> Keep notes to share with your doctor
          </td>
          <td style="padding: 12px;">
            <strong>📝 ಪ್ರಗತಿ ಟ್ರ್ಯಾಕ್:</strong> ವೈದ್ಯರೊಂದಿಗೆ ಹಂಚಲು ಟಿಪ್ಪಣಿಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div class="section" style="background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%); border-left-color: #ff9800;">
    <h2 style="color: #ef6c00;">🌟 Encouragement & Support</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 10px; text-align: center;">
      <p style="font-size: 18px; color: #e65100; font-weight: 600; margin-bottom: 15px;">
        "Your health journey is important, and you're taking the right steps!"
      </p>
      <p style="color: #666; line-height: 1.8;">
        By being proactive about your health, you're already ahead. Remember that:
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px;">
          <p style="font-size: 24px; margin-bottom: 5px;">✨</p>
          <p style="color: #2e7d32; font-weight: 600;">You're Not Alone</p>
          <p style="font-size: 13px; color: #555;">Medical professionals are here to help you</p>
        </div>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
          <p style="font-size: 24px; margin-bottom: 5px;">💪</p>
          <p style="color: #1565c0; font-weight: 600;">Stay Strong</p>
          <p style="font-size: 13px; color: #555;">Your body has amazing healing abilities</p>
        </div>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px;">
          <p style="font-size: 24px; margin-bottom: 5px;">🎯</p>
          <p style="color: #6a1b9a; font-weight: 600;">One Step at a Time</p>
          <p style="font-size: 13px; color: #555;">Progress happens gradually and surely</p>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
          <p style="font-size: 24px; margin-bottom: 5px;">🌈</p>
          <p style="color: #e65100; font-weight: 600;">Better Days Ahead</p>
          <p style="font-size: 13px; color: #555;">With care, things will improve</p>
        </div>
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER:</strong><br>
    This report is generated by artificial intelligence and is intended for informational purposes only. 
    It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the 
    advice of your physician or other qualified health provider with any questions you may have regarding 
    a medical condition. Never disregard professional medical advice or delay in seeking it because of 
    something you have read in this report. If you think you may have a medical emergency, call your 
    doctor or emergency services immediately.
  </div>

  <div class="footer">
    <p><strong>MediConnect AI</strong> - Microsoft Imagine Cup 2026</p>
    <p>Powered by Azure OpenAI GPT-4 & Azure Translator</p>
    <p style="margin-top: 10px;">This report was generated using advanced AI technology to assist in preliminary health assessment.</p>
    <p style="margin-top: 10px; color: #999;">Report ID: ${Date.now()}</p>
  </div>
</body>
</html>
    `;
  };

  const downloadReport = () => {
    setGenerating(true);
    
    setTimeout(() => {
      const htmlContent = generatePDFContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MediConnect_Health_Report_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setGenerating(false);
      toast.success('📄 Health report downloaded! Open it and print to PDF', { duration: 5000 });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <FileText className="w-6 h-6 text-purple-600" />
            AI Health Report
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Download your comprehensive health analysis report
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
          <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {analysis?.possible_conditions?.length || 0}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Conditions</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
          <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {analysis?.recommendations?.length || 0}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Tips</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
          <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {analysis?.urgency_level || 'N/A'}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Urgency</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Today</div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadReport}
        disabled={generating}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {generating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>
            Generating Report...
          </>
        ) : (
          <>
            <Download className="w-6 h-6" />
            Download Health Report (HTML)
          </>
        )}
      </motion.button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
        💡 Tip: Open the downloaded HTML file and use your browser's "Print to PDF" to get a PDF version
      </p>
    </motion.div>
  );
};

export default HealthReportGenerator;
