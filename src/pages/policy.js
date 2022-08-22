import React, { useEffect } from "react";
import { Row, Card, CardTitle } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";
import IntlMessages from "helpers/IntlMessages";
import { adminRoot } from "constants/defaultValues";
import { setCurrentUser } from "helpers/Utils";
import { logoutUser } from "redux/actions";

const Unauthorized = () => {
  useEffect(() => {
    document.body.classList.add("background");
    document.body.classList.add("no-footer");

    return () => {
      document.body.classList.remove("background");
      document.body.classList.remove("no-footer");
    };
  }, []);

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    window.location.href = "/usuario";
  };

  return (
    <>
      {/* <div className="fixed-background" /> */}
      <main>
        <div className="container">
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="form-side">
                  <CardTitle className="mb-4">Esta política de Termos de Uso é válida a partir de Aug 2022</CardTitle>
                  <p className="mb-0 mb-0 text-justify">
                    <b>TERMOS DE USO</b>
                    <br />
                    <br />
                    <br />
                    Help Me Help Me, pessoa jurídica de direito privado descreve, através deste documento, as regras de uso do site helpme.app.br e qualquer
                    outro site, loja ou aplicativo operado pelo proprietário.
                    <br />
                    <br />
                    Ao navegar neste website, consideramos que você está de acordo com os Termos de Uso abaixo. Caso você não esteja de acordo com as condições
                    deste contrato, pedimos que não faça mais uso deste website, muito menos cadastre-se ou envie os seus dados pessoais.
                    <br />
                    <br />
                    Se modificarmos nossos Termos de Uso, publicaremos o novo texto neste website, com a data de revisão atualizada. Podemos alterar este
                    documento a qualquer momento.
                    <br />
                    <br />
                    Caso haja alteração significativa nos termos deste contrato, podemos informá-lo por meio das informações de contato que tivermos em nosso
                    banco de dados ou por meio de notificações.
                    <br />
                    <br />A utilização deste website após as alterações significa que você aceitou os Termos de Uso revisados. Caso, após a leitura da versão
                    revisada, você não esteja de acordo com seus termos, favor encerrar o seu acesso.
                    <br />
                    <br />
                    <b>Seção 1 -</b> Usuário A utilização deste website atribui de forma automática a condição de Usuário e implica a plena aceitação de todas
                    as diretrizes e condições incluídas nestes Termos.
                    <br />
                    <br />
                    <b>Seção 2 -</b> Adesão em conjunto com a Política de Privacidade A utilização deste website acarreta a adesão aos presentes Termos de Uso e
                    a versão mais atualizada da Política de Privacidade de Help Me.
                    <br />
                    <br />
                    <b>Seção 3 -</b> Condições de acesso Em geral, o acesso ao website da Help Me possui caráter gratuito e não exige prévia inscrição ou
                    registro. Contudo, para usufruir de algumas funcionalidades, o usuário poderá precisar efetuar um cadastro, criando uma conta de usuário com
                    login e senha próprios para acesso.
                    <br />É de total responsabilidade do usuário fornecer apenas informações corretas, autênticas, válidas, completas e atualizadas, bem como
                    não divulgar o seu login e senha para terceiros. Partes deste website oferecem ao usuário a opção de publicar comentários em determinadas
                    áreas. Help Me não consente com a publicação de conteúdos que tenham natureza discriminatória, ofensiva ou ilícita, ou ainda infrinjam
                    direitos de autor ou quaisquer outros direitos de terceiros.
                    <br />A publicação de quaisquer conteúdos pelo usuário deste website, incluindo mensagens e comentários, implica em licença não-exclusiva,
                    irrevogável e irretratável, para sua utilização, reprodução e publicação pela Help Me no seu website, plataformas e aplicações de internet,
                    ou ainda em outras plataformas, sem qualquer restrição ou limitação.
                    <br />
                    <br />
                    <b>Seção 4 -</b> Cookies Informações sobre o seu uso neste website podem ser coletadas a partir de cookies.
                    <br />
                    Cookies são informações armazenadas diretamente no computador que você está utilizando.
                    <br />
                    Os cookies permitem a coleta de informações tais como o tipo de navegador, o tempo despendido no website, as páginas visitadas, as
                    preferências de idioma, e outros dados de tráfego anônimos. Nós e nossos prestadores de serviços utilizamos informações para proteção de
                    segurança, para facilitar a navegação, exibir informações de modo mais eficiente, e personalizar sua experiência ao utilizar este website,
                    assim como para rastreamento online. Também coletamos informações estatísticas sobre o uso do website para aprimoramento contínuo do nosso
                    design e funcionalidade, para entender como o website é utilizado e para auxiliá-lo a solucionar questões relevantes.
                    <br />
                    Caso não deseje que suas informações sejam coletadas por meio de cookies, há um procedimento simples na maior parte dos navegadores que
                    permite que os cookies sejam automaticamente rejeitados, ou oferece a opção de aceitar ou rejeitar a transferência de um cookie (ou cookies)
                    específico(s) de um site determinado para o seu computador.
                    <br />
                    Entretanto, isso pode gerar inconvenientes no uso do website. As definições que escolher podem afetar a sua experiência de navegação e o
                    funcionamento que exige a utilização de cookies. Neste sentido, rejeitamos qualquer responsabilidade pelas consequências resultantes do
                    funcionamento limitado deste website provocado pela desativação de cookies no seu dispositivo (incapacidade de definir ou ler um cookie).
                    <br />
                    <br />
                    <b>Seção 5 -</b> Propriedade Intelectual Todos os elementos de Help Me são de propriedade intelectual da mesma ou de seus licenciados. Estes
                    Termos ou a utilização do website não concede a você qualquer licença ou direito de uso dos direitos de propriedade intelectual da Help Me
                    ou de terceiros.
                    <br />
                    <br />
                    <b>Seção 6 -</b> Links para sites de terceiros Este website poderá, de tempos a tempos, conter links de hipertexto que redirecionará você
                    para sites das redes dos nossos parceiros, anunciantes, fornecedores etc.
                    <br />
                    Se você clicar em um desses links para qualquer um desses sites, lembre-se que cada site possui as suas próprias práticas de privacidade e
                    que não somos responsáveis por essas políticas. Consulte as referidas políticas antes de enviar quaisquer Dados Pessoais para esses sites.
                    <br />
                    Não nos responsabilizamos pelas políticas e práticas de coleta, uso e divulgação (incluindo práticas de proteção de dados) de outras
                    organizações, tais como Facebook, Apple, Google, Microsoft, ou de qualquer outro desenvolvedor de software ou provedor de aplicativo, loja
                    de mídia social, sistema operacional, prestador de serviços de internet sem fio ou fabricante de dispositivos, incluindo todos os Dados
                    Pessoais que divulgar para outras organizações por meio dos aplicativos, relacionadas a tais aplicativos, ou publicadas em nossas páginas em
                    mídias sociais.
                    <br />
                    Nós recomendamos que você se informe sobre a política de privacidade e termos de uso de cada site visitado ou de cada prestador de serviço
                    utilizado.
                    <br />
                    <br />
                    <b>Seção 7 -</b> Prazos e alterações O funcionamento deste website se dá por prazo indeterminado. O website no todo ou em cada uma das suas
                    seções, pode ser encerrado, suspenso ou interrompido unilateralmente por Help Me, a qualquer momento e sem necessidade de prévio aviso.
                    <br />
                    <br />
                    <b>Seção 8 -</b> Dados pessoais Durante a utilização deste website, certos dados pessoais serão coletados e enviados; tais como: localização
                    e notificações Push serão tratados por Help Me e/ou pelos Parceiros. As regras relacionadas ao tratamento de dados pessoais de Help Me estão
                    estipuladas na Política de Privacidade.
                    <br />
                    <br />
                    <b>Seção 9 -</b> Contato Caso você tenha qualquer dúvida sobre os Termos de Uso, por favor, entre em contato pelo e-mail
                    contato@helpme.app.br.
                  </p>
                </div>
              </Card>
            </Colxx>
          </Row>
        </div>
      </main>
    </>
  );
};

export default Unauthorized;
