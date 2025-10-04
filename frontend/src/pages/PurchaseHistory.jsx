import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import UserStoreSidebar from '../components/StoreUserSidebar';

// ✅ Import Material UI Icons
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// ✅ Import PDF libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Footer from '../components/Footer';

function PurchaseHistory() {
    const [purchaseData, setPurchaseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupByMode, setGroupByMode] = useState('all');

    const sidebarWidth = 220;

    const dashboardContentStyle = {
        padding: '30px',
        marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0',
        backgroundColor: '#000000', // full black background
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease-in-out',
    };

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?.id;
                if (!userId) throw new Error('User ID not found');

                const response = await axiosInstance.get(`/payment/purchase-history/${userId}`);
                setPurchaseData(response.data);
            } catch (err) {
                console.error(err);
                setError('Unable to load purchase history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseHistory();
    }, []);

    const groupByMonthYear = (data) => {
        return data.reduce((groups, item) => {
            const date = new Date(item.createdAt);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!groups[yearMonth]) groups[yearMonth] = [];
            groups[yearMonth].push(item);
            return groups;
        }, {});
    };

    const formatMonthYear = (key) => {
        const [year, month] = key.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const getCurrentMonthPurchases = () => {
        const now = new Date();
        return purchaseData.filter((purchase) => {
            const date = new Date(purchase.createdAt);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
    };

    const generatePDF = (purchases) => {
        const doc = new jsPDF();

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const receiverName = user?.name || 'User';
        const receiverEmail = user?.email || 'user@example.com';

        // Sender (your business) info
        const sender = {
            name: 'GymStore.',
            email: 'support@gymstore.com',
            address: '123 Business Rd, Commerce City, CA',
        };

        // Header
        doc.setFontSize(16);
        doc.text('Monthly Purchase Orders Report', 14, 20);

        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 14, 28);

        let y = 36;

        doc.setFont(undefined, 'bold');
        doc.text('From:', 14, y);
        doc.setFont(undefined, 'normal');
        doc.text(`${sender.name}`, 30, y);
        doc.text(`${sender.email}`, 30, y + 5);
        doc.text(`${sender.address}`, 30, y + 10);

        y += 20;

        doc.setFont(undefined, 'bold');
        doc.text('To:', 14, y);
        doc.setFont(undefined, 'normal');
        doc.text(`${receiverName}`, 30, y);
        doc.text(`${receiverEmail}`, 30, y + 5);

        const tableY = y + 15;
        const tableData = purchases.map((purchase, index) => [
            index + 1,
            purchase.card_holder,
            `**** **** **** ${purchase.card_number.slice(-4)}`,
            purchase.exp_date,
            new Date(purchase.createdAt).toLocaleDateString(),
            `$${purchase.payment.toFixed(2)}`,
        ]);

        const totalPayment = purchases.reduce((sum, p) => sum + p.payment, 0);

        autoTable(doc, {
            startY: tableY,
            head: [['#', 'Card Holder', 'Card Number', 'Exp. Date', 'Payment Date', 'Payment']],
            body: tableData,
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [76, 175, 80],
                textColor: 255,
            },
            didDrawPage: (data) => {
                const finalY = data.cursor.y + 10;
                doc.setFont(undefined, 'bold');
                doc.text('Total Payment:', data.settings.margin.left + 10, finalY);
                doc.text(`$${totalPayment.toFixed(2)}`, data.settings.margin.left + 60, finalY);
                doc.setFont(undefined, 'normal');
            },
        });

        doc.save(`Purchase_Report_Current_Month_${formattedDate}.pdf`);
    };

    const renderTable = (data) => (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Card Holder</th>
                    <th style={styles.th}>Card Number</th>
                    <th style={styles.th}>Exp. Date</th>
                    <th style={styles.th}>Payment Date</th>
                    <th style={styles.th}>Payment</th>
                </tr>
            </thead>
            <tbody>
                {data.map((purchase, index) => (
                    <tr key={purchase._id} style={styles.row}>
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>{purchase.card_holder}</td>
                        <td style={styles.td}>**** **** **** {purchase.card_number.slice(-4)}</td>
                        <td style={styles.td}>{purchase.exp_date}</td>
                        <td style={styles.td}>{new Date(purchase.createdAt).toLocaleDateString()}</td>
                        <td style={styles.td}>${purchase.payment.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
        <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
            <main style={{ marginLeft:'50px', marginRight:'50px'}}>
                <h4 style={{ marginBottom: '20px', color: '#fff', fontSize: '50px' }}>Purchase History</h4>

                {/* PDF Download Button */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => generatePDF(getCurrentMonthPurchases())}
                        style={styles.redButton}
                    >
                        📄 Download Current Month Report (PDF)
                    </button>
                </div>

                {/* Group By Tabs */}
                <div style={styles.groupByTabs}>
                    <button
                        onClick={() => setGroupByMode('all')}
                        style={{
                            ...styles.redButton,
                            ...(groupByMode === 'all' ? styles.activeTab : {}),
                        }}
                    >
                        <ListAltIcon style={styles.icon} />
                        All
                    </button>
                    <button
                        onClick={() => setGroupByMode('monthly')}
                        style={{
                            ...styles.redButton,
                            ...(groupByMode === 'monthly' ? styles.activeTab : {}),
                        }}
                    >
                        <CalendarTodayIcon style={styles.icon} />
                        Monthly
                    </button>
                </div>

                {/* Data Display */}
                {loading ? (
                    <div style={styles.message}>⏳ Loading...</div>
                ) : error ? (
                    <div style={{ ...styles.message, color: 'red' }}>{error}</div>
                ) : purchaseData.length === 0 ? (
                    <div style={styles.message}>No purchase history found.</div>
                ) : groupByMode === 'all' ? (
                    renderTable(purchaseData)
                ) : (
                    Object.entries(groupByMonthYear(purchaseData))
                        .sort((a, b) => b[0].localeCompare(a[0]))
                        .map(([groupKey, purchases]) => (
                            <section key={groupKey} style={{ marginBottom: '2rem' }}>
                                <h3 style={styles.monthHeading}>{formatMonthYear(groupKey)}</h3>
                                {renderTable(purchases)}
                            </section>
                        ))
                )}
            </main>
        </div>
            <Footer />
            </>
    );
}

const styles = {
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'navy',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        color: '#fff',
    },
    th: {
        borderBottom: '2px solid #ccc',
        padding: '12px 15px',
        backgroundColor: '#001f4d',
        textAlign: 'left',
        fontWeight: '600',
        color: '#fff',
        whiteSpace: 'nowrap',
    },
    td: {
        borderBottom: '1px solid #eee',
        padding: '12px 15px',
        color: '#fff',
        whiteSpace: 'nowrap',
    },
    row: {
        transition: 'background-color 0.25s ease-in-out',
    },
    groupByTabs: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
    },
    redButton: {
        padding: '10px 20px',
        backgroundColor: 'red',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    activeTab: {
        backgroundColor: '#b30000',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(255, 0, 0, 0.4)',
    },
    icon: {
        fontSize: '20px',
    },
    message: {
        padding: '1.2rem 1rem',
        backgroundColor: '#222',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '1rem',
        textAlign: 'center',
    },
    monthHeading: {
        marginBottom: '14px',
        fontSize: '1.25rem',
        color: '#fff',
        borderBottom: '2px solid #555',
        paddingBottom: '6px',
    },
};

export default PurchaseHistory;
