CREATE DATABASE darkbot CHARACTER SET utf8;
USE darkbot;

CREATE TABLE guilds (
    guildid varchar(255),
    themecolor TEXT,
    language TEXT,
    welcometype varchar(255),
    leavetype varchar(255),
    altprevtime TEXT,
    currency TEXT,
    toslink TEXT,
    paypal TEXT,
    cashapp TEXT,
    custompay TEXT,
    maxtickets INT,
    muterole varchar(255),
    welcomecardurl TEXT,
    verification boolean,
    captcha boolean,
    autorole boolean,
    altprev boolean,
    lockdown boolean,
    leveling boolean,
    levelkick boolean,
    birthdays boolean
);

CREATE TABLE economyusers (
    guildid varchar(255),
    userid varchar(255),
    balance INT,
    bank INT,
    workCooldown varchar(255),
    crimeCooldown varchar(255),
    robCooldown varchar(255)
);

CREATE TABLE clients (
    guildid varchar(255),
    userid varchar(255),
    uniqueid INT
);

CREATE TABLE cases (
    guildid varchar(255),
    caseid INT,
    userid varchar(255),
    enforcerid varchar(255),
    casetype varchar(255),
    reason varchar(255),
    timedate TEXT
);

CREATE TABLE selfrolemenus (
    guildid varchar(255),
    uniqueid TEXT,
    menuname TEXT
);

CREATE TABLE selfroles (
    guildid varchar(255),
    panelid TEXT,
    roleid TEXT,
    rolename TEXT
);

CREATE TABLE stickymsgs (
    guildid varchar(255),
    channel varchar(255),
    response TEXT
);

CREATE TABLE ticketcategories (
    guildid varchar(255),
    uniqueid TEXT,
    catid varchar(255),
    catname TEXT,
    catdesc TEXT
);

CREATE TABLE tickets (
    guildid varchar(255),
    userid varchar(255),
    claimedby varchar(255),
    channelid varchar(255),
    catuniqueid TEXT
);

CREATE TABLE offlinebans (
    guildid varchar(255),
    userid varchar(255),
    reason TEXT,
    enforcerid varchar(255)
);

CREATE TABLE chatlvl (
    guildid varchar(255),
    userid varchar(255),
    userxp INT,
    userlvl INT
);

CREATE TABLE marriage (
    guildid varchar(255),
    userid varchar(255),
    spouse varchar(255),
    confirmed boolean
);

CREATE TABLE birthdays (
    guildid varchar(255),
    userid TEXT,
    deDate TEXT
);

CREATE TABLE shop (
    guildid varchar(255),
    productId varchar(255),
    productName TEXT,
    productPrice INT
);

CREATE TABLE owneditems (
    guildid varchar(255),
    productId varchar(255),
    productName TEXT,
    userid varchar(255)
);

CREATE TABLE autoroles (
    guildid varchar(255),
    roleid varchar(255),
    verify boolean
);

CREATE TABLE pingprev (
    guildid varchar(255),
    userid varchar(255),
    themecolor TEXT,
    imagelink TEXT
);

CREATE TABLE autoreact (
    guildid varchar(255),
    channelid varchar(255),
    emoji TEXT
);

CREATE TABLE autorespond (
    guildid varchar(255),
    detect TEXT,
    response TEXT
);

CREATE TABLE filtered (
    guildid varchar(255),
    content TEXT
);

CREATE TABLE afkusers (
    guildid varchar(255),
    userid varchar(255)
);

CREATE TABLE giveaways (
    prize TEXT,
    winners TEXT,
    timelimit TEXT,
    uniqueid INT,
    messageid varchar(255),
    channelid varchar(255),
    active varchar(255),
    starter varchar(255)
);

CREATE TABLE giveawayentrys (
    gid varchar(255),
    userid varchar(255)
);

CREATE TABLE applications (
    guildid varchar(255),
    closed boolean,
    uniqueid TEXT,
    appname TEXT,
    acceptMessage TEXT,
    denyMessage TEXT
);

CREATE TABLE applicationquestions (
    appid TEXT,
    question TEXT
);

/*
    CHANNEL TYPES:
    welcome
    leave
    membercount
    usercount
    rolecount
    channelcount
    channellogs
    rolelogs
    modlogs
    ticketlogs
    messagelogs
    commandlogs
    altprevlogs
    dmlogs
    serverlocklogs
    birthdaylogs
    filterlogs
    applicationlogs
    leveluplogs
    otherlogs
*/
CREATE TABLE channels (
    guildid varchar(255),
    channelid varchar(255),
    channeltype TEXT
);

/*
    PERMISSION TYPES:
    admin - can access all commands
    mod - can access all moderation commands
    filter - can access filter commands and bypass filters
    info - can access all info commands
    sticky - can access all sticky commands
    giveaway - can access all giveaway commands
    clients - can manage clients
    tickets - can access all tickets
    applications - can access all applications commands
    customers - can send reviews
    pingprev - can access ping prevention and bypass ping prevention
*/
CREATE TABLE perms (
    guildid varchar(255),
    roleid varchar(255),
    permtype TEXT
);

-- Conversions
ALTER DATABASE darkbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE guilds CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE economyusers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE clients CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE cases CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE selfrolemenus CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE stickymsgs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE ticketcategories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE tickets CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE offlinebans CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE chatlvl CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE marriage CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE birthdays CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE shop CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE owneditems CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE autoroles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE pingprev CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE autoreact CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE autorespond CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE filtered CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE afkusers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE giveaways CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE giveawayentrys CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE applications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE applicationquestions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE channels CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE perms CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;