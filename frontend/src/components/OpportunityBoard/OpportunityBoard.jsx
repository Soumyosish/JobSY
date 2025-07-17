import React from 'react';
import './OpportunityBoard.css';

const data = [
  {
    month: 'July',
    jobs: [
      { company: 'Google', position: 'Software Engineer', type: 'Full Time', package: '₹30 LPA' },
      { company: 'Amazon', position: 'SDE Intern', type: 'Internship', package: '₹1.2 L/month' },
      { company: 'Microsoft', position: 'Product Manager', type: 'Full Time', package: '₹35 LPA' },
    ],
  },
  {
    month: 'September',
    jobs: [
      { company: 'Samsung', position: 'Hardware Engineer', type: 'Full Time', package: '₹22 LPA' },
      { company: 'Adobe', position: 'UI/UX Intern', type: 'Internship', package: '₹90K/month' },
    ],
  },
  {
    month: 'November',
    jobs: [
      { company: 'Juspay', position: 'Backend Intern', type: 'Internship', package: '₹80K/month' },
    ],
  },
];

function OpportunityBoard() {
  return (
    <div className="opportunity-board-container">
      <h2 className="opportunity-title">Recent &amp; Upcoming Hiring Updates</h2>
      {data.map((section) => (
        <div key={section.month} className="opportunity-section">
          <div className="opportunity-month">{section.month}</div>
          <div className="opportunity-table-wrapper">
            <table className="opportunity-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Type</th>
                  <th>Stipend/Package</th>
                </tr>
              </thead>
              <tbody>
                {section.jobs.map((job, idx) => (
                  <tr key={idx}>
                    <td>{job.company}</td>
                    <td>{job.position}</td>
                    <td>{job.type}</td>
                    <td>{job.package}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OpportunityBoard; 