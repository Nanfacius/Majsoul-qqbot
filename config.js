config = {
    appid: '102281402', // qq�����˵�appID (����)
    secret: 'dGtWAoS6kO2gL0fKzeJyeK0gM2iP6nUB', // qq�����˵�secret (����)
    sandbox: true, // �Ƿ���ɳ�价�� Ĭ�� false
    removeAt: true, // �Ƴ���һ��at Ĭ�� false
    logLevel: 'info', // ��־�ȼ� Ĭ�� info
    maxRetry: 10, // ����������� Ĭ�� 10
    intents: [
        'GROUP_AT_MESSAGE_CREATE', // Ⱥ��@��Ϣ�¼� û��ȺȨ����ע��
        'C2C_MESSAGE_CREATE', // ˽���¼� û��˽��Ȩ����ע��
        'GUILD_MESSAGES', // ˽�������Ƶ����Ϣ�¼� �����������ע��
        // 'PUBLIC_GUILD_MESSAGES', // ���������Ƶ����Ϣ�¼� ˽���������ע��
        'DIRECT_MESSAGE', // Ƶ��˽���¼�
        'GUILD_MESSAGE_REACTIONS', // Ƶ����Ϣ��̬�¼�
        'GUILDS', // Ƶ������¼�
        'GUILD_MEMBERS', // Ƶ����Ա����¼�
        'DIRECT_MESSAGE', // Ƶ��˽���¼�
    ], // (����)
}

module.exports = config