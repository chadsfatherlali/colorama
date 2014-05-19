# -*- coding: utf-8 -*-

import sys
import getpass

usuario = getpass.getuser()
usuariospermitidos = [
	"ssanchez",
	"rlopez"
]


if usuario in usuariospermitidos:
	print "El usuario " + usuario + " esta permitido"
else:
	print "El usuario " + usuario + " no esta permitido"
	


