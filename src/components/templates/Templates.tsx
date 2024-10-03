import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert';
import ReactQuill from 'react-quill';
import ReactMarkdown from 'react-markdown';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { templateSelectors } from '../../redux/template';
import {
  getAllTemplates,
  addEmailTemplate,
  removeEmailTemplate,
  editEmailTemplate,
} from '../../redux/template';
import { userSelectors } from '../../redux/user';
import { sendEmail } from '../../redux/email';
import { warningAlert, openConfirmation } from '../../redux/alerts';
import { Typography, Tabs, Tab, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomTabPanel from './components/CustomTabPanel';
import { emailValidation } from '../../utils';
import { crud } from '../../constants/crud';
import { ITemplate, IAddEmailTemplate, IEditEmailTemplate, ISendEmail } from '../../types';
import { convertToMarkdown } from '../../utils';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos CSS de react-quill
import styles from './Templates.module.css';
import { DefaultTemplates } from './DefaultTemplates';

export function Templates() {
  const dispatch = useAppDispatch();

  const emailTemplates = useAppSelector(templateSelectors.emailTemplates);
  const userData = useAppSelector(userSelectors.userData);

  const editorRef = useRef<ReactQuill>(null);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(getAllTemplates());
  }, [dispatch]);

  const handleChange = (_: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddTemplate = (params: IAddEmailTemplate) => {
    dispatch(addEmailTemplate(params));
  };

  const handleEditTemplate = (params: IEditEmailTemplate) => {
    dispatch(editEmailTemplate(params));
  };

  const handleSendEmail = (params: ISendEmail) => {
    dispatch(sendEmail(params));
  };

  const handleDeleteTemplate = async (template: ITemplate) => {
    const isConfirmed = await dispatch(
      openConfirmation({
        message:
          "Are you sure you want to delete this Email Template? You won't be able to recover it after deletion is complete. ",
        title: 'Confirm delete Email Template',
      }),
    ).unwrap();

    if (isConfirmed) {
      const params = {
        userId: template.userId,
        templateId: template.emailtemplate[0]._id || '',
      };

      dispatch(removeEmailTemplate(params));
    }
  };

  const handleOpenEditor = (actionType: string, template?: ITemplate) => {
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

    //if user will send an email, set the input
    if (actionType === crud.SEND) {
      inputElement.id = 'email';
      inputElement.name = 'email';
      inputElement.placeholder = 'Insert Email';
      inputElement.type = 'email';
      inputElement.style.marginBottom = '20px';
      inputElement.style.padding = '10px';

      divElement.appendChild(inputElement);
      contentNode.appendChild(divElement);
    } else {
      //if not, it will send or edit a template/email
      const reactQuillElement = React.createElement(ReactQuill, {
        value: actionType !== crud.ADD.toString() ? template?.emailtemplate[0].content || '' : '',
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
      // const editorRoot = createRoot(contentNode);
      // editorRoot.render(reactQuillElement)

      inputElement.id = 'subject';
      inputElement.name = 'subject';
      inputElement.placeholder = 'Subject';
      inputElement.style.marginBottom = '20px';
      inputElement.style.padding = '10px';
      inputElement.value =
        actionType !== crud.ADD.toString() ? template?.emailtemplate[0].subject || '' : '';

      contentNode.insertBefore(inputElement, contentNode.firstChild);
    }

    //open de modal
    swal({
      title:
        actionType === crud.ADD.toString()
          ? 'Add email template'
          : actionType === crud.EDIT.toString()
          ? 'Edit email template'
          : 'Send email',
      text:
        actionType === crud.ADD.toString()
          ? 'You can add an email template for your pitching'
          : actionType === crud.EDIT.toString()
          ? 'You can edit this email template for your pitching'
          : '',
      content: { element: contentNode },
      buttons:
        actionType === crud.ADD.toString()
          ? ['Cancel', 'Add']
          : actionType === crud.EDIT.toString()
          ? ['Cancel', 'Edit']
          : ['Cancel', 'Send'],
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
        if (actionType !== crud.SEND && editorContent?.trim() === '') {
          dispatch(
            warningAlert({
              title: 'Empty Content',
              message: 'The content of the template cannot be empty',
            }),
          );
        } else if (actionType !== crud.SEND && subjectInput?.trim() === '') {
          dispatch(
            warningAlert({
              title: 'Empty Subject',
              message: 'The subject of the template cannot be empty',
            }),
          );
        } else if (actionType === crud.SEND.toString()) {
          //TO SEND AN EMAIL
          const emailDestination = subjectInput;

          //VALIDATE IF EMAIL IS EMPTY OR NOT VALID
          if (subjectInput?.trim() === '' || !emailValidation(emailDestination)) {
            dispatch(
              warningAlert({
                title: 'Wrong email',
                message: 'Insert an email valid',
              }),
            );
          } else {
            //IF CONTENT AND EMAIL DESTINATION ARE VALID SET PARAMS
            const params = {
              emailData: {
                emaiAccountdata: userData || undefined,
                emailval: emailDestination,
                message: template?.emailtemplate[0].content || '',
                subject: template?.emailtemplate[0].subject || '',
              },
            };

            //SEND EMAIL
            handleSendEmail(params);
          }

          //IF USER WANTS TO EDIT OR CREATE
        } else if (editorContent.trim() !== '' && subjectInput !== '') {
          //TO EDIT A TEMPLATE
          if (actionType === crud.EDIT.toString()) {
            const params = {
              templateId: template?._id || '',
              template: {
                _id: template?.emailtemplate[0]._id || '',
                subject: subjectInput,
                content: editorContent || '',
                date: template?.emailtemplate[0].date || new Date(),
                editDate: new Date(),
              },
              userId: userData?._id || '',
            };

            handleEditTemplate(params);
          } else if (actionType === crud.ADD.toString()) {
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
      }
    });
  };

  return (
    <div className={`${styles.emailTemplatesWrapper}`}>
      <Typography variant="h3" color="primary" m="2rem 0">
        Pitch templates
      </Typography>
      <div className={styles.contentWrapper}>
        <Tabs value={activeTab} onChange={handleChange} variant="fullWidth">
          <Tab label="Default Templates" sx={{ fontWeight: 'bold' }} />
          <Tab label="My Templates" sx={{ fontWeight: 'bold' }} />
        </Tabs>
        <CustomTabPanel value={activeTab} index={0}>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            <DefaultTemplates />
          </Typography>
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={1}>
          <>
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
              onClick={() => {
                handleOpenEditor(crud.ADD.toString());
              }}
              sx={{ mb: '1rem', mx: 'auto', width: ' 40%' }}
            >
              Add template
            </Button>
            {!emailTemplates.length ? (
              <Typography variant="body1" color="text.secondary" fontWeight="bold">
                No templates to show
              </Typography>
            ) : (
              <div className={styles.templatesExistingWrapper}>
                {emailTemplates.map((item, index) => {
                  if (item.userId && !!item.emailtemplate.length) {
                    return (
                      <div key={index} className={`${styles.emailTemplateItem}`}>
                        <div>
                          <Typography variant="body2" color="text.secondary">
                            <b>Subject</b>
                            <br />
                            {item.emailtemplate[0].subject || ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>Message</b>
                          </Typography>
                          <ReactMarkdown>
                            {convertToMarkdown(item.emailtemplate[0].content || '')}
                          </ReactMarkdown>
                        </div>
                        <div className={styles.buttonsWrapper}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDeleteTemplate(item);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleOpenEditor(crud.EDIT.toString(), item);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleOpenEditor(crud.SEND.toString(), item);
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </>
        </CustomTabPanel>
      </div>
    </div>
  );
}
