import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TextEditor from "../auth/TextEditor";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import DOMPurify from 'dompurify';


const ComposeMailForm = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  // const user = localStorage.getItem('UserMail');
  const userId = localStorage.getItem('UserMail');
  const encodedUserId = encodeURIComponent(userId);
  const userToken = localStorage.getItem('token');

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userId);
    console.log(userToken);
   
  
    try {

      const sanitizedContent = DOMPurify.sanitize(
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
      );


      const newMail = {
        senderEmail: userId,
        receiverEmail: email,
        subject,
        content: sanitizedContent,
        timestamp: new Date().toISOString(),
        read: false,
      };
  
      console.log('Request Payload:', JSON.stringify(newMail));
  
      const response = await fetch(
        `https://mailbox-da34e-default-rtdb.firebaseio.com/allMails.json`,
        // `https://mailbox-da34e-default-rtdb.firebaseio.com/users/${encodedUserId}/sent.json`,
        {
          method: 'POST',
          body: JSON.stringify(newMail),
          headers: {
            // 'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Server Response:', response);
  
      if (!response.ok) {
        throw new Error(`Failed to submit data. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data submitted successfully:', data);
  
      setEmail('');
      setSubject('');
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      console.error('Error:', error.message);
      // Provide user-friendly error message or notification
    }
  };
  
  

  return (
    <div>
      <h2>Compose Mail</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Recipient Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="editor">
          <Form.Label>Compose Mail</Form.Label>
          <TextEditor onEditorStateChange={handleEditorChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Mail
        </Button>
      </Form>
    </div>
  );
};

export default ComposeMailForm;
