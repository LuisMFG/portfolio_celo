import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();


        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }


        const sanitizedData = {
            name: body.name.trim().substring(0, 100),
            email: body.email.trim().toLowerCase(),
            subject: body.subject.trim().substring(0, 200),
            message: body.message.trim().substring(0, 2000),
        };


        const { data, error } = await resend.emails.send({
            from: `${sanitizedData.name} <onboarding@resend.dev>`, // Use seu domínio verificado
            to: [process.env.CONTACT_EMAIL!],
            subject: `Contato: ${sanitizedData.subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nova mensagem de contato do seu portfolio!
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Informações do contato:</h3>
            <p><strong>Nome:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            <p><strong>Assunto:</strong> ${sanitizedData.subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #495057; margin-top: 0;">Mensagem:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedData.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p style="margin: 0;">Esta mensagem foi enviada através do formulário de contato do seu site.</p>
            <p style="margin: 5px 0 0 0;">Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `,
            replyTo: sanitizedData.email,
        });

        if (error) {
            console.error('Erro ao enviar email:', error);
            return NextResponse.json(
                { error: 'Erro interno do servidor' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Email enviado com sucesso', id: data?.id },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro na API de contato:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}