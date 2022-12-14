import { MailPreview } from './mail-preview.jsx'

export function MailList({ inbox, onTrashMail, onOpenMail }) {

    return <ul className="mail-list clean-list">
        {inbox.map((mail) => {
            return <MailPreview
                key={mail.id}
                mail={mail}
                onTrashMail={onTrashMail}
                onOpenMail={onOpenMail} />
        })}
    </ul>
}