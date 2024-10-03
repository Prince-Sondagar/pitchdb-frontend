
import { Button, Typography } from '@mui/material';
import styles from './Templates.module.css';
import templatesData from '../templates/assets/templates.json';
import ReactMarkdown from 'react-markdown';
import { convertToMarkdown } from '../../utils';
import ReactQuill from 'react-quill';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert';
import { IAddEmailTemplate } from '../../types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { warningAlert } from '../../redux/alerts';
import { userSelectors } from '../../redux/user';
import { addEmailTemplate } from '../../redux/template';

interface INewTemplate {
    id: string,
    subject: string,
    content: string,
}

export const DefaultTemplates = () => {

    const dispatch = useAppDispatch();

    const editorRef = useRef<ReactQuill>(null);

    const userData = useAppSelector(userSelectors.userData);

    const handleAddTemplate = (params: IAddEmailTemplate) => {
        //to delete
        console.log('params ', params);
        dispatch(addEmailTemplate(params));
    };
    

    const handleOpenEditor = (template: INewTemplate) => {
        //create the wrapper
        const contentNode = document.createElement('div');
        contentNode.style.display = 'flex';
        contentNode.style.flexDirection = 'column';
    
        const divElement = document.createElement('div');
        divElement.style.display = 'flex';
        divElement.style.flexDirection = 'column';
        divElement.style.width = '100%';
        divElement.style.marginBottom = '20px';
    
        //creating the input
        const inputElement = document.createElement('input');
    
        const reactQuillElement = React.createElement(ReactQuill, {
            value: template?.content || '',
            ref: editorRef,
            className: 'custom-quill',
            style: {
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '40vh',
                height: '40vh',
                width: '100%',
                marginBottom: '20px',
            },
        });
    
        ReactDOM.render(reactQuillElement, contentNode);

        inputElement.id = 'subject';
        inputElement.name = 'subject';
        inputElement.placeholder = 'Subject';
        inputElement.style.marginBottom = '20px';
        inputElement.style.padding = '10px';
        inputElement.value = template?.subject || '';

        contentNode.insertBefore(inputElement, contentNode.firstChild);
    
        //open de modal
        swal({
          title: 'Add email template',
          text: 'You can add an email template for your pitching',
          content: { element: contentNode },
          buttons: ['Cancel', 'Add'],
          className: 'custom-modal',
        }).then((value) => {
          //if user select any option
          if (value) {
            //save subject and message
            const subjectInput = inputElement.value?.trim() || '';
            let editorContent = editorRef.current?.getEditor().root.innerHTML?.trim() || '';
    
            //IF CONTENT IS EMPTY. DELETE ANY INNERHTML
            if (editorRef.current?.getEditor().root.innerText.trim() === '') {
              editorContent = '';
            }
    
            //IF CONTENT OR SUBJECT IS EMPTY. SHOW ERROR
            if (editorContent?.trim() === '') {
              dispatch(
                warningAlert({
                  title: 'Empty Content',
                  message: 'The content of the template cannot be empty',
                }),
              );
            } else if (subjectInput?.trim() === '') {
              dispatch(
                warningAlert({
                  title: 'Empty Subject',
                  message: 'The subject of the template cannot be empty',
                }),
              );
            } else if (editorContent.trim() !== '' && subjectInput !== '') {

                const params = {
                    userId: userData?._id || '',
                    template: {
                        id: '',
                        subject: subjectInput,
                        content: editorContent || '',
                        date: new Date(),
                    },
                };
    
                handleAddTemplate(params);
            }
          }
        });
      };

    return (
        <div className={styles.templatesExistingWrapper}>
            {!templatesData.length ? (
            <Typography variant="body1" color="text.secondary" fontWeight="bold">
                No templates to show
            </Typography>
            ) : (
                <>
                    {templatesData.map((item, index) => {
                        //to delete
                        console.log('item ', item);
                        return (
                            <div key={index} className={`${styles.emailTemplateItem}`}>
                            <div>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Subject</b>
                                    <br />
                                {item.subject || ''}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Message</b>
                                </Typography>
                                <ReactMarkdown>
                                    {convertToMarkdown(item.content || '')}
                                </ReactMarkdown>
                            </div>
                            <div className={styles.buttonsWrapper}>.
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  handleOpenEditor(item);
                                }}
                                sx={{ mb: '1rem' }}
                            >
                                    Add Template
                                </Button>
                            </div>
                            </div>
                        );
                        
                    })}
                </>
                
            )}
        </div>
    )
}
