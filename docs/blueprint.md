# Lead & Promotions Bot — Bot specification

**Archetype:** custom

**Voice:** professional and concise — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot for a digital marketing business that collects leads through interactive conversations, delivers scheduled promotions/newsletters to subscribers, and notifies the owner of new leads. Supports both on-demand lead exports and owner-controlled message scheduling with opt-in management.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- prospective clients
- existing subscribers
- business owner/sales team

## Success criteria

- Lead records stored with contact details and opt-in status
- Scheduled messages delivered to specified segments
- Owner receives instant lead notifications
- Users can unsubscribe or update preferences

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open the main welcome menu with service overview and quick actions
- **Learn offers** (button, actor: user, callback: offers:menu) — Display service/offer details with follow-up options
  - inputs: selected offer
  - outputs: offer details, contact prompt
- **Talk to sales** (button, actor: user, callback: lead:start) — Initiate lead collection flow
  - inputs: name, contact method, interest note
  - outputs: lead confirmation, consent prompt
- **Subscribe to promos** (button, actor: user, callback: subscribe:start) — Request marketing opt-in and confirm subscription
  - inputs: consent confirmation
  - outputs: subscription confirmation
- **/leads** (command, actor: owner, command: /leads) — View lead summary and request CSV export
  - inputs: export request
  - outputs: lead count, CSV file
- **/schedule** (command, actor: owner, command: /schedule) — Create a new scheduled promotion
  - inputs: message content, send time, segment selection
  - outputs: scheduled message confirmation
- **/broadcast-now** (command, actor: owner, command: /broadcast-now) — Send immediate broadcast to selected segment
  - inputs: message content, segment selection, confirmation
  - outputs: broadcast delivery status
- **/settings** (command, actor: owner, command: /settings) — Configure business info and owner notification preferences
  - inputs: Telegram ID, business display info
  - outputs: settings confirmation
- **/unsubscribe** (command, actor: user, command: /unsubscribe) — Remove user from marketing segments
  - inputs: confirmation
  - outputs: unsubscription confirmation
- **/myinfo** (command, actor: user, command: /myinfo) — View or update stored lead information
  - inputs: updated contact info
  - outputs: current lead data, update confirmation

## Flows

### Lead Collection
_Trigger:_ button:Talk to sales or /start

1. Request name
2. Request contact method
3. Request interest note
4. Request marketing consent
5. Store lead record
6. Send owner notification

_Data touched:_ User, Lead record, Notification

### Scheduled Promotions
_Trigger:_ /schedule

1. Request message content
2. Request send datetime
3. Request segment selection
4. Store message schedule
5. Trigger delivery at scheduled time

_Data touched:_ Message schedule, User

### Broadcast Management
_Trigger:_ /broadcast-now

1. Request message content
2. Request segment selection
3. Request confirmation
4. Send immediate broadcast

_Data touched:_ User

### Preference Management
_Trigger:_ /myinfo or /unsubscribe

1. Display current info
2. Request updates
3. Process unsubscription
4. Confirm changes

_Data touched:_ User

### Owner Settings
_Trigger:_ /settings

1. Request owner Telegram ID
2. Request business display info
3. Store settings

_Data touched:_ User

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **User** _(retention: persistent)_ — Telegram contact with business relationship status
  - fields: telegram_id, display_name, username, subscriber_status, tags, lead_opt_in
- **Lead record** _(retention: persistent)_ — Qualified lead with contact and interest data
  - fields: name, contact_method, note, opt_in_status, timestamp, source, tags
- **Message schedule** _(retention: persistent)_ — Scheduled broadcast with delivery parameters
  - fields: content, send_datetime, timezone, segment_type, segment_criteria
- **Notification** _(retention: none)_ — Owner alert about new leads
  - fields: lead_summary, export_link

## Integrations

- **Telegram** (required) — Bot API messaging and user interaction
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Configure business display info
- Set owner Telegram ID for notifications
- Schedule promotions
- Export lead data as CSV
- Send immediate broadcasts

## Notifications

- Owner receives lead summary notification with export link
- Users receive scheduled promotions with unsubscribe option

## Permissions & privacy

- Explicit opt-in required for marketing messages
- Secure storage of lead data with owner-controlled retention
- User can view/update/delete their data via /myinfo

## Edge cases

- User declines to provide contact method
- Owner fails to set their Telegram ID during setup
- Scheduled message time in the past
- User unsubscribes but has no active subscriptions
- Invalid segment criteria in scheduling

## Required tests

- End-to-end lead collection with owner notification
- Scheduled message delivery to correct segment
- CSV export includes all stored lead fields
- Unsubscribe action prevents future messages

## Assumptions

- Owner will manually follow up on leads using exported data
- CSV export format will be standardized for owner usability
- Marketing opt-in is required by default for compliance
