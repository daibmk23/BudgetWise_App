import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import searchImage from "../../assets/search.svg";
import "./styles.css";
import Button from '../Button';
import Papa from 'papaparse';

const { Option } = Select;

function TransactionsTable({ transactions, setTransactions }) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Tag", dataIndex: "tag", key: "tag" },
    ];

    let filteredTransactions = transactions.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
    );

    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    /** Export transactions to CSV */
    const exportToCsv = () => {
        const csvData = Papa.unparse(transactions);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /** Import transactions from CSV */
    const importFromCsv = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        Papa.parse(file, {
            complete: (result) => {
                const parsedData = result.data
                    .filter(row => row.name) // Ensure we don't include empty rows
                    .map(row => ({
                        name: row.name, 
                        type: row.type,
                        date: row.date,
                        amount: parseFloat(row.amount),
                        tag: row.tag
                    }));
    
                setTransactions(prev => [...prev, ...parsedData]);
            },
            header: true, // This ensures the first row is treated as column names
            skipEmptyLines: true
        });
    };
    

    return (
        <div style={{ width: "100%", padding: "0rem 2rem" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1rem",
            }}>
                <div className="input-flex">
                    <img src={searchImage} width="16" alt="search" />
                    <input placeholder="Search by Name" onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>

            <div className="my-table">
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "1rem",
                }}>
                    <h2>My Transactions</h2>

                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort by Date</Radio.Button>
                        <Radio.Button value="amount">Sort by Amount</Radio.Button>
                    </Radio.Group>

                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "400px" }}>
                        <Button text="Export to CSV" className="btn" onClick={exportToCsv} />

                        <Button for="file-csv" className="btn btn-blue" text="Import from CSV">
                            <input
                                onChange={importFromCsv}
                                id="file-csv"
                                type="file"
                                accept=".csv"
                                required
                                style={{ display: "none" }}
                            />
                        </Button>
                    </div>
                </div>

                <Table dataSource={sortedTransactions} columns={columns} />
            </div>
        </div>
    );
}

export default TransactionsTable;
