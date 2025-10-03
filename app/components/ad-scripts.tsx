const AdScripts = () => {
  return (
    <>
      {/* Google Adsense */}
      <script
        async
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3632222360837456"
      />

      {/* Google tag (gtag.js) */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-SVP41D6M1G"
      />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SVP41D6M1G');
          `,
        }}
      />

      {/* Adsterra Native Banner */}
      {/* <script async data-cfasync="false" src="your_js"></script> */}
    </>
  );
};

export { AdScripts };
