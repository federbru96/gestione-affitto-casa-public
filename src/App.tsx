import React, { useState, useEffect } from 'react';
import { Calendar, Download, Zap, Upload, Paperclip, User, Lock, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import { generateReceiptPDF } from './utils/pdfGenerator';

export default function App() {
  const [contract, setContract] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'owner' | 'tenant'>('tenant');
  
  const [session, setSession] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [billForm, setBillForm] = useState({
    type: 'Luce',
    billAmount: '',
    tenantShare: '',
    selectedMonthId: '',
    fileName: null as string | null,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setViewMode('owner');
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setViewMode('owner');
      else setViewMode('tenant');
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data: tenantData, error: tErr } = await supabase
        .from('tenants')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (tErr) throw tErr;
      if (tenantData) setContract(tenantData);

      const { data: paymentsData, error: pErr } = await supabase
        .from('payments')
        .select('*')
        .order('id');
      if (pErr) throw pErr;
      if (paymentsData) setPayments(paymentsData);
    } catch (err: any) {
      console.error('Errore dettagliato:', err);
      setErrorMsg(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Errore di accesso: credenziali non valide.');
    } else {
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBillForm({ ...billForm, fileName: file.name });
  };

  const handleApplyUtility = async (e: React.FormEvent) => {
    e.preventDefault();
    const share = parseFloat(billForm.tenantShare);
    const monthId = Number(billForm.selectedMonthId);
    if (isNaN(share) || share <= 0 || !monthId) {
      alert('Inserisci un importo valido e seleziona un mese.');
      return;
    }

    const paymentToUpdate = payments.find((p) => p.id === monthId);
    if (!paymentToUpdate) return;

    let publicUrl = paymentToUpdate.utility_file_url;
    const fileInput = (document.getElementById('pdf-file-input') as HTMLInputElement)?.files?.[0];

    if (fileInput) {
      const fileName = `bolletta_${monthId}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('bollette').upload(fileName, fileInput);

      if (uploadError) {
        alert('Errore durante il caricamento del file PDF: ' + uploadError.message);
        return;
      }

      const { data: publicURLData } = supabase.storage.from('bollette').getPublicUrl(fileName);
      publicUrl = publicURLData.publicUrl;
    }

    const newUtility = Number(paymentToUpdate.utility_amount) + share;
    const newTotal = Number(paymentToUpdate.rent_amount) + newUtility;

    const { error } = await supabase
      .from('payments')
      .update({ utility_amount: newUtility, total: newTotal, utility_file_url: publicUrl })
      .eq('id', monthId);

    if (!error) {
      await supabase.from('bills').insert([
        {
          payment_id: monthId,
          utility_type: billForm.type,
          total_bill_amount: parseFloat(billForm.billAmount) || share,
          tenant_share: share,
          file_url: publicUrl,
        },
      ]);
      alert('Documento caricato e collegato con successo in automatico!');
      fetchData();
      setBillForm({ type: 'Luce', billAmount: '', tenantShare: '', selectedMonthId: '', fileName: null });
      const fileInputEl = document.getElementById('pdf-file-input') as HTMLInputElement;
      if (fileInputEl) fileInputEl.value = '';
    } else {
      alert('Errore nel salvataggio su database: ' + error.message);
    }
  };

  const togglePaymentStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Pagato' ? 'In attesa' : 'Pagato';
    const payDate = newStatus === 'Pagato' ? new Date().toISOString().split('T')[0] : null;

    const { error } = await supabase
      .from('payments')
      .update({ status: newStatus, pay_date: payDate })
      .eq('id', id);

    if (!error) fetchData();
  };

  if (errorMsg) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff5f5', color: '#c53030', minHeight: '100vh' }}>
        <h2>Errore di connessione a Supabase:</h2>
        <p style={{ fontWeight: 'bold' }}>{errorMsg}</p>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Caricamento dati dal database in corso... ⏳</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '16px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '24px', backgroundColor: 'white', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0, color: '#1a202c' }}>
              {viewMode === 'owner' ? 'Gestione Affitto Transitorio (Proprietario)' : 'Area Personale Inquilino'}
            </h1>
            <p style={{ color: '#718096', margin: '4px 0 0 0', fontSize: '13px' }}>
              {contract?.address} — {contract?.tenant_name}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {session ? (
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                <LogOut size={16}/> Esci (Logout)
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2d3748', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                <Lock size={16}/> Accesso Proprietario
              </button>
            )}
          </div>
        </header>

        {/* MODALE LOGIN */}
        {showLoginModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '320px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Lock color="#2d3748" size={20}/>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Accesso Amministratore</h3>
              </div>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button type="submit" style={{ flex: 1, backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Accedi</button>
                  <button type="button" onClick={() => { setShowLoginModal(false); setEmail(''); setPassword(''); }} style={{ flex: 1, backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Annulla</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VISTA PROPRIETARIO */}
        {viewMode === 'owner' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Calendar color="#3182ce" size={20}/>
                  <h2 style={{ fontSize: '18px', margin: 0, color: '#2d3748' }}>Prossima Scadenza Canone</h2>
                </div>
                <div>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#2d3748' }}>€ {contract?.monthly_rent}</p>
                  <p style={{ color: '#718096', margin: '4px 0 0 0', fontSize: '14px' }}>Scadenza: il {contract?.due_day} del mese</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Zap color="#d69e2e" size={20}/>
                  <h2 style={{ fontSize: '18px', margin: 0, color: '#2d3748' }}>Carica Nuova Bolletta</h2>
                </div>
                <form onSubmit={handleApplyUtility} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#4a5568' }}>Tipo Utenza</label>
                      <select value={billForm.type} onChange={(e) => setBillForm({ ...billForm, type: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}>
                        <option value="Luce">Luce</option>
                        <option value="Gas">Gas</option>
                        <option value="Acqua">Acqua</option>
                        <option value="Internet">Internet</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#4a5568' }}>Mese</label>
                      <select value={billForm.selectedMonthId} onChange={(e) => setBillForm({ ...billForm, selectedMonthId: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}>
                        <option value="">Seleziona mese...</option>
                        {payments.map((p) => <option key={p.id} value={p.id}>{p.month}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#4a5568' }}>Totale Documento (€)</label>
                      <input type="number" step="0.01" value={billForm.billAmount} onChange={(e) => setBillForm({ ...billForm, billAmount: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#4a5568' }}>Quota Inquilino (€)</label>
                      <input type="number" step="0.01" value={billForm.tenantShare} onChange={(e) => setBillForm({ ...billForm, tenantShare: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#edf2f7', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', border: '1px dashed #cbd5e0' }}>
                      <Upload size={14}/> Allega PDF
                      <input id="pdf-file-input" type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                    <span style={{ fontSize: '12px', color: '#718096', wordBreak: 'break-all' }}>{billForm.fileName || 'Nessun file'}</span>
                  </div>
                  <button type="submit" style={{ backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salva</button>
                </form>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#2d3748' }}>Registro Pagamenti (Gestione)</h2>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #edf2f7', color: '#718096', fontSize: '14px' }}>
                      <th style={{ padding: '12px 8px' }}>Mese</th>
                      <th style={{ padding: '12px 8px' }}>Canone</th>
                      <th style={{ padding: '12px 8px' }}>Utenze</th>
                      <th style={{ padding: '12px 8px' }}>Totale</th>
                      <th style={{ padding: '12px 8px' }}>Stato</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Azione</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #edf2f7', fontSize: '14px' }}>
                        <td style={{ padding: '12px 8px', fontWeight: '500' }}>{p.month}</td>
                        <td style={{ padding: '12px 8px' }}>€ {p.rent_amount}</td>
                        <td style={{ padding: '12px 8px' }}>€ {p.utility_amount}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>€ {p.total}</td>
