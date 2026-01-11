# Download flags from flagcdn.com
  for code in ar au at be br ca cl cn co hr cz dk eg fi fr de gr hu in id ie il it jp my mx nl nz ng no pk pe ph pl pt ro ru sa sg za kr es se ch th tr ua ae gb us vn; do
    curl -s "https://flagcdn.com/${code}.svg" -o "./public/flags/${code}.svg"
    echo "Downloaded ${code}.svg"
  done