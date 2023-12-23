import React, { useEffect, useState } from 'react';
import { Table, Badge, Modal, Button, Container } from 'react-bootstrap';

const AllMails = ({ type }) => {
  const [mails, setMails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMail, setSelectedMail] = useState(null);
  const user = localStorage.getItem('UserMail');
  // const userToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchMails = async () => {
      try {
        let endpoint;
        if (type === 'inbox') {
          endpoint = `https://mailbox-da34e-default-rtdb.firebaseio.com/allMails.json?orderBy="receiverEmail"&equalTo="${user}"`;
        } else if (type === 'sent') {
          endpoint = `https://mailbox-da34e-default-rtdb.firebaseio.com/allMails.json?orderBy="senderEmail"&equalTo="${user}"`;
        }
  
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch mails. Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data) {
          const mailArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setMails(mailArray);
          // Count unread messages
          const unreadMessages = mailArray.filter((mail) => !mail.read);
          setUnreadCount(unreadMessages.length);
          console.log('Fetched mails!!!');
        } else {
          setMails([]);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error fetching mails:', error.message);
        // Handle error, e.g., display an error message to the user
      }
    };
  
    // Initial fetch when the component mounts
    fetchMails();
  
    // Set up a periodic polling to refresh data every 2 seconds
    const intervalId = setInterval(fetchMails, 2000);
  
    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [user, type]);
  

  

  // Function to mark a message as read
  const markAsRead = async (mailId) => {
    console.log(mailId);
  
    try {
      // Update the message as read in the backend
      const response = await fetch(
        `https://mailbox-da34e-default-rtdb.firebaseio.com/allMails/${mailId}.json`,
        {
          method: 'PATCH', // Use PATCH method to update specific fields
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            read: true, // Set read attribute to true
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to mark message as read. Status: ${response.status}`);
      }
  
      // Update the local state to mark the message as read
      const updatedMails = mails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail
      );
      setMails(updatedMails);
  
      // Update unread count
      const unreadMessages = updatedMails.filter((mail) => !mail.read);
      setUnreadCount(unreadMessages.length);
  
      // Clear selected mail when marked as read
      setSelectedMail(null);
    } catch (error) {
      console.error('Error marking message as read:', error.message);
      // Handle error, e.g., display an error message to the user
    }
  };
  

  // Function to handle selecting a mail for full content view
  const selectMail = async (mailId) => {
    const selected = mails.find((mail) => mail.id === mailId);

    // Check if the mail is not read, then update it as read
    if (selected && !selected.read) {
      await markAsRead(selected.id);
    }

    setSelectedMail(selected);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setSelectedMail(null);
  };


  const deleteMail = async (mailId) => {
    try {
      // Delete the mail from the backend
      const response = await fetch(
        `https://mailbox-da34e-default-rtdb.firebaseio.com/allMails/${mailId}.json`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete mail. Status: ${response.status}`);
      }

      // Update the local state to remove the deleted mail
      const updatedMails = mails.filter((mail) => mail.id !== mailId);
      setMails(updatedMails);

      // Close the modal if the deleted mail was the selected one
      if (selectedMail && selectedMail.id === mailId) {
        setSelectedMail(null);
      }

      // Update unread count
      const unreadMessages = updatedMails.filter((mail) => !mail.read);
      setUnreadCount(unreadMessages.length);
    } catch (error) {
      console.error('Error deleting mail:', error.message);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    // <Container fluid>
    <div>
      <h3 className="mb-4">
        {type === 'inbox' ? 'Inbox' : 'Sent'}{' '}
        {unreadCount > 0 && <Badge variant="primary">{unreadCount}</Badge>}
      </h3>
      {mails.length === 0 ? (
        <p>No mails available</p>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-light table-borderless">
        <thead className="thead-light">
          <tr>
            <th className="text-uppercase">Subject</th>
            <th className="text-uppercase">{type === 'inbox' ? 'Sender' : 'Receiver'}</th>
            <th className="text-uppercase">Content</th>
            <th className="text-uppercase">Action</th>
          </tr>
        </thead>
        <tbody>
          {mails.map((mail) => (
            <tr
              key={mail.id}
              className={`${
                !mail.read ? 'table-primary font-weight-bold' : 'table-secondary'
              }`}
            >
              <td onClick={() => selectMail(mail.id)}>
  {mail.read ? (
    <p className="mb-0">{mail.subject}</p>
  ) : (
    <div>
      <p className="mb-0"><span className="mr-2" style={{ color: 'blue', fontSize: '27px' }}>&#8226;  </span>{ mail.subject}</p>
    </div>
  )}
</td>

              <td>{type === 'inbox' ? mail.senderEmail : mail.receiverEmail}</td>
              <td>
                <p className="mb-0">{mail.content}</p>
              </td>
              <td className="text-center">
                <Button variant="danger" size="sm" onClick={() => deleteMail(mail.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

          {/* Modal for displaying full content */}
          <Modal show={!!selectedMail} onHide={handleClose} dialogClassName="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Your mail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>From:</strong> {selectedMail?.senderEmail}</p>
              <p><strong>Subject:</strong> {selectedMail?.subject}</p>
              <p><strong>Message:</strong> {selectedMail?.content}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  // </Container>
  );
};

export default AllMails;



