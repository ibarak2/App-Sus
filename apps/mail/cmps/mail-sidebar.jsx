const { Link, NavLink, withRouter } = ReactRouterDOM


export function MailSideBar({ onCompose }) {


    return <div className="mail-sidebar">
        <button className="compose" onClick={onCompose}><i className="fa-solid fa-pen"></i>Compose</button>

        <NavLink to='/mail/inbox'>
            <div className="sidebar-item sidebar-inbox">
                <i className="sidebar-icon fa-solid fa-inbox"></i>
                <span>Inbox</span>
                <span></span>
            </div>
        </NavLink>
        <NavLink to='/mail/starred'>
            <div className="sidebar-item sidebar-Starred">
                <i className="sidebar-icon star fa-regular fa-star"></i>
                <span>Starred</span>
            </div>
        </NavLink>
        <NavLink to='/mail/sent'>
            <div className="sidebar-item sidebar-Sent">
                <i className="sidebar-icon fa-solid fa-paper-plane"></i>
                <span>Sent</span>
            </div>
        </NavLink>
        <NavLink to='/mail/trash'>
            <div className="sidebar-item sidebar-Trash">
                <i className="sidebar-icon fa-solid fa-trash-can"></i>
                <span>Trash</span>
            </div>
        </NavLink>
    </div>

}