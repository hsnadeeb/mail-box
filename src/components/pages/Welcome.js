import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
// import TextEditor from '../auth/TextEditor';
import ComposeMailForm from '../auth/ComposeMailForm';

const Welcome = () => {
  const [showEditor, setShowEditor] = useState(false);

  const handleOpenEditor = () => {
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  return (
    <div>
      <h2>Welcome to the mailbox</h2>
      <Button onClick={handleOpenEditor}>
        Componse Mail
      </Button>

      <Modal show={showEditor} onHide={handleCloseEditor}>
        <Modal.Header closeButton>
          <Modal.Title>Mail Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ComposeMailForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Welcome;
