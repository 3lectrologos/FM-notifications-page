'use client'

import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import { useState } from 'react'

type BaseNotificationProps = {
  name: string
  when: string
}

type NotificationReactProps = BaseNotificationProps & {
  type: 'react'
  postName: string
  postURL: string
}

type NotificationFollowProps = BaseNotificationProps & {
  type: 'follow'
}

type NotificationJoinProps = BaseNotificationProps & {
  type: 'join'
  groupName: string
  groupURL: string
}

type NotificationLeaveProps = BaseNotificationProps & {
  type: 'leave'
  groupName: string
  groupURL: string
}

type NotificationPMProps = BaseNotificationProps & {
  type: 'pm'
  message: string
}

type NotificationCommentProps = BaseNotificationProps & {
  type: 'comment'
  imageURL: string
}

type NotificationProps =
  NotificationReactProps | NotificationFollowProps | NotificationJoinProps |
  NotificationLeaveProps | NotificationPMProps | NotificationCommentProps

function UnreadIndicator({ unread }: { unread: boolean }) {
  return (
    <>
      { unread && <div className={`inline-block w-2 h-2 shrink-0 rounded-full bg-red ml-[7px]`} /> }
    </>
  )
}

function NotificationTime({ when }: { when: string }) {
  return (
    <div className={`text-grayish-blue`}>
      {when}
    </div>
  )
}

function NotificationSubject({ name }: { name: string }) {
  return (
    <>
      <span className={`font-extrabold text-very-dark-blue`}>
        {name}
      </span>
      <span className={`pr-1.5`}>
      </span>
    </>
  )
}

function ReactNotificationBody({props, unread}: { props: NotificationReactProps, unread: boolean }) {
  let { postName, postURL, when } = props
  return (
    <div className={`flex flex-col gap-y-[3px]`}>
      <div>
        <NotificationSubject name={props.name}/>
        <span className={`mr-1.5`}>
          reacted to your recent post
        </span>
        <span className={`font-extrabold`}>
          {postName}
        </span>
        <UnreadIndicator unread={unread}/>
      </div>
      <NotificationTime when={when}/>
    </div>
  )
}

function FollowNotificationBody({props, unread }: { props: NotificationFollowProps, unread: boolean }) {
  let { when } = props
  return (
    <div className={`flex flex-col gap-y-[3px]`}>
      <div>
        <NotificationSubject name={props.name}/>
        <span className={``}>
          followed you
        </span>
        <UnreadIndicator unread={unread}/>
      </div>
      <NotificationTime when={when}/>
    </div>
  )
}

function JoinNotificationBody({props, unread }: { props: NotificationJoinProps, unread: boolean }) {
  let { groupName, groupURL, when } = props
  return (
    <div className={`flex flex-col gap-y-[3px]`}>
      <div>
        <NotificationSubject name={props.name}/>
        <span className={`mr-1.5`}>
          has joined your group
        </span>
        <span className={`font-bold text-blue`}>
          {groupName}
        </span>
        <UnreadIndicator unread={unread}/>
      </div>
      <NotificationTime when={when}/>
    </div>
  )
}

function LeaveNotificationBody({props, unread }: { props: NotificationLeaveProps, unread: boolean }) {
  let { groupName, groupURL, when } = props
  return (
    <div className={`flex flex-col gap-y-[3px]`}>
      <div>
        <NotificationSubject name={props.name}/>
        <span className={`mr-1.5`}>
          left the group
        </span>
        <span className={`font-bold text-blue`}>
          {groupName}
        </span>
        <UnreadIndicator unread={unread}/>
      </div>
      <NotificationTime when={when}/>
    </div>
  )
}

function PMNotificationBody({props, unread }: { props: NotificationPMProps, unread: boolean }) {
  let { when, message } = props
  return (
    <div className={`flex flex-col gap-y-[3px]`}>
      <div>
        <NotificationSubject name={props.name} />
        <span className={``}>
          send you a private message
        </span>
        <UnreadIndicator unread={unread} />
      </div>
      <NotificationTime when={when} />
      <div className={`p-4 mt-[9px] rounded-[5px] border border-light-grayish-blue-2`}>
        {message}
      </div>
    </div>
  )
}

function CommentNotificationBody({ props, unread }: { props: NotificationCommentProps, unread: boolean }) {
  let { imageURL, when } = props
  return (
      <div className={`flex flex-row`}>
        <div className={`flex flex-col gap-y-[3px]`}>
          <div>
            <NotificationSubject name={props.name}/>
            <span className={``}>
              commented on your picture
            </span>
            <UnreadIndicator unread={unread}/>
          </div>
          <NotificationTime when={when}/>
        </div>
        <div className={`shrink-0 relative w-10 h-10 ml-6`}>
          <Image src={imageURL} alt="image" fill={true}/>
        </div>
      </div>
  )
}

function Notification({props, unread}: { props: NotificationProps, unread: boolean }) {
  let { name, when } = props
  let avatarPath = `/images/avatar-${name.toLowerCase().split(' ').join('-')}.webp`

  return (
    <div className={twMerge(
      `flex flex-row gap-x-[13px] py-4 pl-4 pr-3 font-medium leading-[130%] rounded-lg`,
      `${unread ? 'bg-very-light-grayish-blue' : 'bg-white'}`
    )}>
      <div className={`relative shrink-0 w-[41px] h-[41px] border border-black/5 rounded-full`}>
        <Image src={avatarPath} alt='avatar' fill={true} />
      </div>
      <div>
        { (props.type === 'react') && <ReactNotificationBody props={props} unread={unread} /> }
        { (props.type === 'follow') && <FollowNotificationBody props={props} unread={unread} /> }
        { (props.type === 'join') && <JoinNotificationBody props={props} unread={unread} /> }
        { (props.type === 'leave') && <LeaveNotificationBody props={props} unread={unread} /> }
        { (props.type === 'pm') && <PMNotificationBody props={props} unread={unread} /> }
        { (props.type === 'comment') && <CommentNotificationBody props={props} unread={unread} /> }
      </div>
    </div>
  )
}

function Title({numNotifications, className='', markReadCallback}: { numNotifications: number, className?: string, markReadCallback?: () => void }) {
  return (
    <div className={twMerge(
      `flex flex-row items-center leading-none`,
      className,
    )}>
      <span className={`text-[20px] font-extrabold mr-[9px] text-very-dark-blue`}>
        Notifications
      </span>
      <span className={`flex flex-col text-[16px] text-white font-extrabold bg-blue w-8 h-[25px] rounded-[6px] text-center pt-1`}>
       {numNotifications}
      </span>
      <span className={`flex-grow`} />
      <span
        className={`justify-self-end`}
        onClick={markReadCallback}
      >
        Mark all as read
      </span>
    </div>
  )
}

const initNotifications: NotificationProps[] = [
  {
    type: 'react',
    name: 'Mark Webber',
    postName: 'My first tournament today!',
    postURL: '',
    when: '1m ago',
  },
  {
    type: 'follow',
    name: 'Angela Gray',
    when: '5m ago',
  },
  {
    type: 'join',
    name: 'Jacob Thompson',
    groupName: 'Chess Club',
    groupURL: '',
    when: '1 day ago',
  },
  {
    type: 'pm',
    name: 'Rizky Hasanuddin',
    when: '5 days ago',
    message: 'Hello, thanks for setting up the Chess Club. I’ve been a member for a few weeks now and I’m already having lots of fun and improving my game.'
  },
  {
    type: 'comment',
    name: 'Kimberly Smith',
    when: '1 week ago',
    imageURL: '/images/image-chess.webp'
  },
  {
    type: 'react',
    name: 'Nathan Peterson',
    postName: '5 end-game strategies to increase your win rate',
    postURL: '',
    when: '2 weeks ago',
  },
  {
    type: 'leave',
    name: 'Anna Kim',
    groupName: 'Chess Club',
    groupURL: '',
    when: '2 weeks ago',
  }
]

const initUnread = [true, true, true, false, false, false, false]

export default function Home() {
  let [notifications, setNotifications] = useState(initNotifications)
  let [unread, setUnread] = useState(initUnread)

  function markAllRead() {
    console.log('markAllRead')
    setUnread(Array.from({length: notifications.length}, () => false))
  }

  return (
    <div className={twMerge(
      `min-h-screen min-w-fit text-[14px] text-dark-grayish-blue font-medium`,
      `desktop:bg-very-light-grayish-blue`
    )}>
      <div className={twMerge(
        `flex flex-col items-center justify-center py-6`,
      )}>
        <div className={twMerge(
          `flex flex-col bg-white w-full max-w-[500px] px-4`,
        )}>
          <Title
            numNotifications={unread.filter((unread) => unread).length}
            markReadCallback={markAllRead}
            className={`mb-6`}
          />
          <div className={twMerge(
            `flex flex-col gap-y-[10px]`,
          )}>
            { notifications.map((notification, index) => (
              <Notification
                key={index}
                props={notification}
                unread={unread[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
