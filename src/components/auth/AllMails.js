import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const AllMails = ({ type }) => {
  const [mails, setMails] = useState([]);
  const user = localStorage.getItem('UserMail');

  useEffect(() => {
    const fetchMails = async () => {
      let endpoint;

      if (type === 'inbox') {
        endpoint = `https://mailbox-da34e-default-rtdb.firebaseio.com/inbox.json`;
      } else if (type === 'sent') {
        endpoint = `https://mailbox-da34e-default-rtdb.firebaseio.com/sent.json`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data) {
        const mailArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setMails(mailArray);
      } else {
        setMails([]);
      }
    };

    fetchMails();
  }, [user, type]);

  return (
    <div>
      <h3>{type === 'inbox' ? 'Inbox' : 'Sent'}</h3>
      {mails.length === 0 ? (
        <p>No mails available</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Receiver</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {mails.map((mail) => (
              <tr key={mail.id}>
                <td>{mail.subject}</td>
                <td>{mail.receiverEmail}</td>
                <td>{mail.content}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AllMails;
