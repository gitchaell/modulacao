grep -rl "Mostrando 24 produtos" src/components/ | xargs sed -i "s/Mostrando 24 produtos/{t('shop.filters.showing')}/g"
