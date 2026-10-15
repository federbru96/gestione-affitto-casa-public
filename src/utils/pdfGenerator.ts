import jsPDF from 'jspdf';

export const generateReceiptPDF = (payment: any, contract: any) => {
  const doc = new jsPDF();

    doc.setFontSize(18);
      doc.text('RICEVUTA DI PAGAMENTO', 105, 20, { align: 'center' });
        
          doc.setFontSize(10);
            doc.text(`Ricevuta N°: RICEV-${payment.id}/${new Date().getFullYear()}`, 20, 35);
              doc.text(`Data Emissione: ${new Date().toLocaleDateString('it-IT')}`, 140, 35);

                doc.line(20, 40, 190, 40);
                  
                    const address = contract?.address || 'Indirizzo non specificato';
                      const tenantName = contract?.tenant_name || 'Inquilino non specificato';
                        const tenantCF = contract?.tenant_cf || 'CF non specificato';

                          doc.text(`Immobile: ${address}`, 20, 50);
                            doc.text(`Inquilino: ${tenantName} (${tenantCF})`, 20, 58);
                              doc.text(`Riferimento Mese: ${payment.month}`, 20, 66);

                                doc.line(20, 75, 190, 75);
                                  doc.text('Descrizione', 20, 83);
                                    doc.text('Importo (€)', 160, 83);
                                      doc.line(20, 87, 190, 87);

                                        doc.text('Canone di locazione', 20, 97);
                                          doc.text(`${Number(payment.rent_amount).toFixed(2)} €`, 160, 97);

                                            doc.text('Rimborso Spese Utenze / Documenti', 20, 107);
                                              doc.text(`${Number(payment.utility_amount).toFixed(2)} €`, 160, 107);

                                                doc.line(20, 115, 190, 115);
                                                  doc.setFontSize(12);
                                                    doc.text('TOTALE RICEVUTO:', 20, 125);
                                                      doc.text(`${Number(payment.total).toFixed(2)} €`, 160, 125);

                                                        doc.setFontSize(9);
                                                          doc.text('Pagamento effettuato a mezzo bonifico bancario.', 20, 145);
                                                            doc.text("Imposta di bollo da 2,00€ assolta sull'originale se dovuta.", 20, 152);

                                                              const safeTenantName = tenantName.replace(/\s+/g, '_');
                                                                const safeMonth = payment.month.replace(/\s+/g, '_');
                                                                  doc.save(`Ricevuta_${safeTenantName}_${safeMonth}.pdf`);
                                                                  };
                                                                  