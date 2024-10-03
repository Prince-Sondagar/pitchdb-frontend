import { outreachSequenceStates } from '../../../../constants';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export function getSequenceIcon(sequenseState: outreachSequenceStates) {
  switch (sequenseState) {
    case outreachSequenceStates.waiting:
      return <HourglassTopIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    case outreachSequenceStates.sent:
      return <SendIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    case outreachSequenceStates.opened:
      return <DraftsIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    case outreachSequenceStates.replied:
      return <MarkEmailReadIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    case outreachSequenceStates.booked:
      return <InsertInvitationIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    case outreachSequenceStates.postponed:
      return <ScheduleSendIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    case outreachSequenceStates.conversed:
      return <QuestionAnswerIcon sx={(theme) => ({ color: theme.palette.text.primary })} />;
    default:
      return <></>;
  }
}
